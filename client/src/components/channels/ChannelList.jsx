import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Channel from './Channel'


class ChannelList extends Component {
    render() {
        return (
            <div className="list-group channel-list">
                {this.props.channels.map(chan => {
                    return <Channel
                        key={chan.id}
                        channel={chan}
                        {...this.props}
                    />
                })}
            </div>
        )
    }
}

ChannelList.propTypes = {
    channels: PropTypes.array.isRequired,
    setChannel: PropTypes.func.isRequired,
    activeChannel: PropTypes.object
}

export default ChannelList