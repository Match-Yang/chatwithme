import React, { Component } from 'react'
import ChannelSection from './components/channels/ChannelSection'
import UserSection from './components/users/UserSection'
import MessageSection from './components/messages/MessageSection'
import Socket from './components/socket'
import "./App.css"

Date.prototype.yyyymmddhhmmss = function () {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    return "" + yyyy + "/" + mm + "/" + dd + "-" + hh + ":" + min + ":" + ss;
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channels: [],
            users: [],
            messages: [],
            activeChannel: {},
            currentUser: {},
            connected: false
        }
    }
    componentDidMount() {
        // TODO change to you domain name
        let ws = new WebSocket("ws://192.168.3.4:1990")
        let socket = this.socket = new Socket(ws);
        socket.on('connect', this.onConnect.bind(this));
        socket.on('disconnect', this.onDisconnect.bind(this));
        socket.on('channel add', this.onAddChannel.bind(this));
        socket.on('user init', this.onInitUser.bind(this));
        socket.on('user add', this.onAddUser.bind(this));
        socket.on('user edit', this.onEditUser.bind(this));
        socket.on('user remove', this.onRemoveUser.bind(this));
        socket.on('message add', this.onAddMessage.bind(this));

    }
    onConnect() {
        this.setState({ connected: true });
        this.socket.emit('channel subscribe');
        this.socket.emit('user subscribe');
    }
    onDisconnect() {
        this.setState({ connected: false });
    }

    onAddChannel(channel) {
        let { channels } = this.state;
        channels.push(channel);
        this.setState({ channels });
    }

    onInitUser(user) {
        this.setState({ currentUser: user })
    }
    onAddUser(user) {
        let { users } = this.state;
        users.push(user);
        this.setState({ users });
    }
    onEditUser(editUser) {
        let { currentUser, users } = this.state;
        users = users.map(user => {
            if (editUser.id === user.id) {
                // update current user name
                if (editUser.id == currentUser.id) {
                    this.setState({ currentUser: editUser })
                }
                return editUser;
            }
            return user;
        })
        this.setState({ users });
    }
    onRemoveUser(removeUser) {
        let { users } = this.state;
        users = users.filter(user => {
            return user.id !== removeUser.id;
        })
        this.setState({ users });
    }
    onAddMessage(message) {
        let { messages } = this.state;
        messages.push(message);
        this.setState({ messages });
    }

    addChannel(name) {
        this.socket.emit('channel add', { name })
    }
    setChannel(activeChannel) {
        this.setState({ activeChannel });
        this.socket.emit('message unsubscribe');
        this.setState({ messages: [] });
        this.socket.emit('message subscribe', activeChannel);
    }
    editUser(name) {
        this.socket.emit('user edit', { name });
    }

    addMessage(body) {
        let { currentUser, activeChannel } = this.state;
        this.socket.emit('message add', {
            channelId: activeChannel.id,
            channelName: activeChannel.name,
            body,
            authorId: currentUser.id,
            author: currentUser.name
        });
    }
    render() {
        return (
            <div className="app h-100">
                <nav className="navbar bg-primary text-white  shadow-sm justify-content-between mb-2">
                    <a className="navbar-brand">Home</a>
                    <form className="form-inline">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
                        <button className="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </nav>
                <div className="row">
                    <div className="col-lg-3 col-12">
                        <div className="row">
                            <div className="col-12">
                                <ChannelSection
                                    {...this.state}
                                    addChannel={this.addChannel.bind(this)}
                                    setChannel={this.setChannel.bind(this)}
                                />
                            </div>
                            <div className="col-12">
                                <UserSection
                                    {...this.state}
                                    editUser={this.editUser.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-12">
                        <MessageSection
                            {...this.state}
                            addMessage={this.addMessage.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App