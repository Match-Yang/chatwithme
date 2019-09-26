import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ChannelForm from "./ChannelForm"
import ChannelList from './ChannelList'

export default function ChannelSection(props) {
    return (
        <div className="container shadow-sm mb-2 channel-section">
            <div className="row">
                <div className="col-12 align-self-start">
                    <div className="navbar navbar-dark bg-secondary">
                        <a className="navbar-brand" href="#">Channels</a>
                    </div>
                </div>
                <div className="col-12 align-self-start">
                    <ChannelList {...props} />
                </div>
                <div className="col-12 align-self-end mb-1">
                    <ChannelForm {...props} />
                </div>
            </div>
        </div>
    );
}

ChannelSection.propTypes = {
    channels: PropTypes.array.isRequired,
    setChannel: PropTypes.func.isRequired,
    addChannel: PropTypes.func.isRequired,
    activeChannel: PropTypes.object
}