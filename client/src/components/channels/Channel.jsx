import React, { Component } from 'react'
import PropTypes from 'prop-types';

class Channel extends Component {
    onClick(e) {
        e.preventDefault();
        const { setChannel, channel } = this.props;
        setChannel(channel);
    }
    render() {
        const { channel, activeChannel } = this.props;
        let classNameStr = channel === activeChannel
            ? "list-group-item list-group-item-action border-0 text-info"
            : "list-group-item list-group-item-action border-0";
        return (
            <a
                href="#"
                className={classNameStr}
                onClick={this.onClick.bind(this)}
            >
                {channel.name}
            </a>
        )
    }
}

Channel.propTypes = {
    channel: PropTypes.object.isRequired,
    setChannel: PropTypes.func.isRequired,
    activeChannel: PropTypes.object
}

export default Channel
