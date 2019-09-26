import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MessageForm from './MessageForm'
import MessageList from './MessageList'

export default function MessageSection(props) {
    return (
        <div className="container shadow-sm message-section">
            <div className="row">
                <div className="col-12 align-self-start">
                    <div className="navbar navbar-dark bg-secondary">
                        <a className="navbar-brand" href="#">{props.activeChannel.name ? props.activeChannel.name : "Unknown"}</a>
                    </div>
                </div>
                <div className="col-12 align-self-start">
                    <MessageList {...props} />
                </div>
                <div className="col-12 align-self-end mb-1">
                    <MessageForm {...props} />
                </div>
            </div>
        </div>
    )
}

MessageSection.propTypes = {
    activeChannel: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    addMessage: PropTypes.func.isRequired
}