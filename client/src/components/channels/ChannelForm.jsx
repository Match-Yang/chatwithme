import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default function ChannelForm(props) {
    function onSubmit(e) {
        e.preventDefault();
        // const node = this.refs.channel;
        const node = e.currentTarget.elements.channel;
        const channelName = node.value;
        props.addChannel(channelName);
        node.value = '';
    }
    return (
        <form onSubmit={onSubmit}>
            <input
                placeholder="New channel name"
                name='channel'
                className="form-control"
            />
        </form>
    )
}

ChannelForm.propTypes = {
    addChannel: PropTypes.func.isRequired
}