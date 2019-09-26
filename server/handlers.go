package main

import (
	"fmt"
	"time"

	r "github.com/dancannon/gorethink"
	"github.com/mitchellh/mapstructure"
)

const (
	ChannelStop = iota
	UserStop
	MessageStop
)

type Channel struct {
	Id   string `json:"id" gorethink:"id,omitempty"`
	Name string `json:"name" gorethink:"name"`
}

type ChannelMessage struct {
	Id          string    `json:"id" gorethink:"id,omitempty"`
	ChannelId   string    `json:"channelId" gorethink:"channelId"`
	ChannelName string    `json:"channelName" gorethink:"channelName"`
	Body        string    `json:"body" gorethink:"body"`
	AuthorId    string    `json:"authorId" gorethink:"authorId"`
	Author      string    `json:"author" gorethink:"author"`
	CreateAt    time.Time `json:"createAt" gorethink:"createAt"`
}

func addChannel(client *Client, data interface{}) {
	var channel Channel
	err := mapstructure.Decode(data, &channel)
	if err != nil {
		client.send <- Message{"error", err.Error()}
		return
	}

	go func() {
		err = r.Table("channel").Insert(channel).Exec(client.session)
		if err != nil {
			client.send <- Message{"error", err.Error()}
		}
	}()
}

func subscribeChannel(client *Client, data interface{}) {
	stop := client.NewStopChannel(ChannelStop)
	result := make(chan r.ChangeResponse)

	cursor, err := r.Table("channel").Changes(r.ChangesOpts{IncludeInitial: true}).Run(client.session)
	if err != nil {
		client.send <- Message{"error", err.Error()}
		return
	}
	go func() {
		var change r.ChangeResponse
		for cursor.Next(&change) {
			result <- change
		}
	}()

	go func() {
		for {
			select {
			case <-stop:
				cursor.Close()
				return
			case change := <-result:
				if change.NewValue != nil && change.OldValue != nil {
					// record update

				} else if change.NewValue == nil && change.OldValue != nil {
					// record remove

				} else {
					// record insert
					client.send <- Message{"channel add", change.NewValue}
				}
			}
		}
	}()
}

func unsubscribeChannel(client *Client, data interface{}) {
	client.StopForKey(ChannelStop)
}

func editUser(c *Client, data interface{}) {
	var user User
	if err := mapstructure.Decode(data, &user); err != nil {
		c.send <- Message{"error", err.Error()}
		return
	}
	c.userName = user.Name
	go func() {
		_, err := r.Table("user").Get(c.id).Update(user).RunWrite(c.session)
		if err != nil {
			c.send <- Message{"error", err.Error()}
		}
	}()
}

func subscribeUser(c *Client, data interface{}) {
	stop := c.NewStopChannel(UserStop)
	result := make(chan r.ChangeResponse)
	cursor, err := r.Table("user").Changes(r.ChangesOpts{IncludeInitial: true}).Run(c.session)
	if err != nil {
		c.send <- Message{"error", err.Error()}
		return
	}

	go func() {
		var change r.ChangeResponse
		for cursor.Next(&change) {
			result <- change
		}
	}()

	go func() {
		for {
			select {
			case <-stop:
				cursor.Close()
				return
			case change := <-result:
				if change.NewValue != nil && change.OldValue != nil {
					// record update
					c.send <- Message{"user edit", change.NewValue}

				} else if change.NewValue == nil && change.OldValue != nil {
					// record remove
					c.send <- Message{"user remove", change.OldValue}

				} else {
					// record insert
					c.send <- Message{"user add", change.NewValue}
				}
			}
		}
	}()

}

func unsubscribeUser(c *Client, data interface{}) {
	c.StopForKey(UserStop)
}

func addMessage(c *Client, data interface{}) {
	var channelMessage ChannelMessage
	if err := mapstructure.Decode(data, &channelMessage); err != nil {
		c.send <- Message{"error", err.Error()}
		return
	}
	channelMessage.CreateAt = time.Now()
	go func() {
		if err := r.Table("message").Insert(channelMessage).Exec(c.session); err != nil {
			c.send <- Message{"error", err.Error()}
		}
	}()

}

func subscribeMessage(c *Client, data interface{}) {
	// Read the actived channel id
	var channel Channel
	if err := mapstructure.Decode(data, &channel); err != nil {
		c.send <- Message{"error", err.Error()}
		fmt.Println(err)
		return
	}
	if channel.Id == "" {
		c.send <- Message{"error", "Channel id can not be empty."}
		fmt.Println("Channel id can not be empty.")
		return
	}

	// read order data
	precursor, _ := r.Table("message").
		OrderBy(r.OrderByOpts{Index: r.Asc("createAt")}).
		Filter(r.Row.Field("channelId").Eq(channel.Id)).
		Run(c.session)
	go func() {
		var message ChannelMessage
		for precursor.Next(&message) {
			c.send <- Message{"message add", message}
		}
	}()

	// Listing data change
	stop := c.NewStopChannel(MessageStop)
	result := make(chan r.ChangeResponse)
	cursor, err := r.Table("message").
		OrderBy(r.OrderByOpts{Index: r.Desc("createAt")}).
		Filter(r.Row.Field("channelId").Eq(channel.Id)).
		Changes().
		Run(c.session)
	if err != nil {
		c.send <- Message{"error", err.Error()}
		fmt.Println(err)
		return
	}
	go func() {
		var change r.ChangeResponse
		for cursor.Next(&change) {
			result <- change
		}
	}()

	go func() {
		for {
			select {
			case <-stop:
				cursor.Close()
				return
			case change := <-result:
				if change.NewValue != nil && change.OldValue == nil {
					c.send <- Message{"message add", change.NewValue}
				}
			}
		}
	}()
}

func unsubscribeMessage(c *Client, data interface{}) {
	c.StopForKey(MessageStop)
}
