import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default function MessageForm(props) {
    function onSubmit(e) {
        e.preventDefault();
        const node = e.currentTarget.elements.message;
        const content = node.value;
        props.addMessage(content);
        node.value = '';
    }

    const { activeChannel } = props;
    let isValid = activeChannel.name && activeChannel.name !== "";
    let msgInput;
    if (isValid) {
        msgInput = <input
            placeholder="Send message"
            name="message"
            className="form-control"
        />
    } else {
        msgInput = <input
            placeholder="Send message"
            name="message"
            className="form-control"
            disabled
        />
    }
    return (
        <form onSubmit={onSubmit}>
            {msgInput}
        </form>
    )
}

MessageForm.propTypes = {
    addMessage: PropTypes.func.isRequired
}