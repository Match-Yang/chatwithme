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

func main() {
	// Connect to database
	session, err := r.Connect(r.ConnectOpts{
		Address:  "localhost:28015",
		Database: "chatwithme",
	})
	if err != nil {
		log.Panic(err.Error())
	}

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
	// http.Handle("/", router)
	// http.ListenAndServe(":1990", nil)
	sm := http.NewServeMux()
	sm.Handle("/", router)

	l, err := net.Listen("tcp", ":1990")
	if err != nil {
		log.Fatal(err)
	}
	log.Fatal(http.Serve(l, sm))
}
