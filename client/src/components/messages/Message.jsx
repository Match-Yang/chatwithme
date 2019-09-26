import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Message extends Component {
    render() {
        let isOwn = this.props.message.authorId === this.props.currentUserId
        let headLine
        let bodyLine
        if (isOwn) {
            headLine = <div className="row justify-content-end">
                <div className="col-md-auto">
                    <span className="font-weight-bold mr-2">{this.props.message.author}</span>
                    <small className="font-italic text-black-50">{(new Date(this.props.message.createAt)).yyyymmddhhmmss()}</small>
                </div>
            </div>

            bodyLine = <div className="row justify-content-end">
                <div className="col-md-auto">
                    <span className="font-weight-light">{this.props.message.body}</span>
                </div>
            </div>
        } else {
            headLine = <div>
                <span className="font-weight-bold mr-2">{this.props.message.author}</span>
                <small className="font-italic text-black-50">{(new Date(this.props.message.createAt)).yyyymmddhhmmss()}</small>
            </div>

            bodyLine = <span className="font-weight-light">{this.props.message.body}</span>
        }
        return (
            <li>
                <div className="container">
                    <div className="row mb-1">
                        <div className="col-12">
                            {headLine}
                        </div>
                        <div className="col-12">
                            {bodyLine}
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}

Message.propTypes = {
    message: PropTypes.object.isRequired,
    currentUserId: PropTypes.string.isRequired
}

export default Message