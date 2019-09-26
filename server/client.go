package main

import (
	"fmt"
	"log"

	r "github.com/dancannon/gorethink"
	"github.com/gorilla/websocket"
)

type FindHandler func(string) (Handler, bool)

type Message struct {
	Name string      `json:"name" gorethink:"name`
	Data interface{} `json:"data" gorethink:"data`
}

type User struct {
	Id   string `json:"id" gorethink:"id,omitempty"`
	Name string `json:"name" gorethink:"name"`
}

type Client struct {
	send         chan Message
	socket       *websocket.Conn
	findHandler  FindHandler
	session      *r.Session
	stopChannels map[int]chan bool
	id           string
	userName     string
}

func NewClient(socket *websocket.Conn, findHandler FindHandler, session *r.Session) *Client {
	var user User
	user.Name = "anonymous"
	res, err := r.Table("user").Insert(user).RunWrite(session)
	if err != nil {
		log.Println(err.Error())
	}
	var id string
	if len(res.GeneratedKeys) > 0 {
		id = res.GeneratedKeys[0]
	}
	return &Client{
		send:         make(chan Message),
		socket:       socket,
		findHandler:  findHandler,
		session:      session,
		stopChannels: make(map[int]chan bool),
		id:           id,
		userName:     user.Name,
	}
}
func (c *Client) SetUserToFrontEnd() {
	c.send <- Message{"user init", User{c.id, c.userName}}
}
func (client *Client) Read() {
	var message Message
	for {
		if err := client.socket.ReadJSON(&message); err != nil {
			break
		}
		if handler, found := client.findHandler(message.Name); found {
			handler(client, message.Data)
		} else {
			fmt.Println("Cant not handle message: ", message.Name)
		}
	}
	client.socket.Close()
}

func (client *Client) Write() {
	for msg := range client.send {
		if err := client.socket.WriteJSON(msg); err != nil {
			break
		}
	}
	client.socket.Close()
}

func (client *Client) NewStopChannel(stopKey int) chan bool {
	client.StopForKey(stopKey)
	stop := make(chan bool)
	client.stopChannels[stopKey] = stop
	return stop
}

func (client *Client) StopForKey(stopKey int) {
	if stop, found := client.stopChannels[stopKey]; found {
		stop <- true
		delete(client.stopChannels, stopKey)
	}
}

func (client *Client) Close() {
	// Remove the user from database
	r.Table("user").Get(client.id).Delete().Exec(client.session)

	for _, val := range client.stopChannels {
		val <- true
	}
	close(client.send)
}
