package main

import (
	"fmt"
	"net/http"

	r "github.com/dancannon/gorethink"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Router struct {
	rules   map[string]Handler
	session *r.Session
}

type Handler func(*Client, interface{})

func (r *Router) FindHandler(name string) (Handler, bool) {
	handler, found := r.rules[name]
	return handler, found
}

func NewRouter(session *r.Session) *Router {
	return &Router{
		rules:   make(map[string]Handler),
		session: session,
	}
}

func (e *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err.Error())

		return
	}

	client := NewClient(socket, e.FindHandler, e.session)
	defer client.Close()
	go client.SetUserToFrontEnd()
	go client.Write()
	client.Read()
}

func (r *Router) Handle(name string, handler Handler) {
	r.rules[name] = handler
}
