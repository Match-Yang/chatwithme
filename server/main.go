package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"

	r "github.com/dancannon/gorethink"
)

const (
	distOnSource = "../client/dist"
	distOnSysdir = "/var/www/chatwithme"
)

func main() {
	// For client http connection
	if success := serveHttp(); !success {
		return
	}

	// Connect to database
	session, err := r.Connect(r.ConnectOpts{
		Address:  "localhost:28015",
		Database: "chatwithme",
	})
	if err != nil {
		log.Panic(err.Error())
	} else {
		// 连接数据库成功后，监听中断事件
		listingSignal(session)
	}

	// Routing front-end control
	router := NewRouter(session)
	router.Handle("channel add", addChannel)
	router.Handle("channel subscribe", subscribeChannel)
	router.Handle("channel unsubscribe", unsubscribeChannel)

	router.Handle("user edit", editUser)
	router.Handle("user subscribe", subscribeUser)
	router.Handle("user unsubscribe", unsubscribeUser)

	router.Handle("message add", addMessage)
	router.Handle("message subscribe", subscribeMessage)
	router.Handle("message unsubscribe", unsubscribeMessage)

	// Start http server and upgrade to websocket
	// This server is for database backend
	sm := http.NewServeMux()
	sm.Handle("/", router)

	l, err := net.Listen("tcp", ":1990")
	if err != nil {
		log.Fatal(err)
	}
	log.Fatal(http.Serve(l, sm))

}

func listingSignal(session *r.Session) {
	// 接收中断信号后，清理数据库
	c := make(chan os.Signal, 1)
	// Passing no signals to Notify means that
	// all signals will be sent to the channel.
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)
	go func() {
		// Block until any signal is received.
		s := <-c
		fmt.Println("Got signal:", s)
		if s == os.Interrupt || s == os.Kill {
			r.Table("user").Delete().Exec(session)
			os.Exit(0)
		}
	}()
}

func serveHttp() bool {
	// Start http server to serve html file
	publicPath := ""
	if _, err := os.Stat(distOnSource); !os.IsNotExist(err) {
		// 能找到源码中的打包资源，优先使用
		publicPath = distOnSource
	} else if _, err := os.Stat(distOnSysdir); !os.IsNotExist(err) {
		// 如果源码目录下没找到，但是系统目录下找到了
		publicPath = distOnSysdir
	}
	if publicPath != "" {
		buildHandler := http.FileServer(http.Dir(publicPath))

		sm := http.NewServeMux()
		sm.Handle("/", buildHandler)

		l, err := net.Listen("tcp", ":4000")
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Serving http resource: ", publicPath)
		go http.Serve(l, sm)
		return true
	} else {
		fmt.Println("Can not found any html resource, the server will not start")
		return false
	}
}
