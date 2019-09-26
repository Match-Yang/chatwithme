import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        // Are we adding new items to the list?
        // Capture the scroll position so we can adjust scroll later.
        const list = this.listRef.current;
        return list.scrollHeight - list.scrollTop;

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // If we have a snapshot value, we've just added new items.
        // Adjust scroll so these new items don't push the old ones out of view.
        // (snapshot here is the value returned from getSnapshotBeforeUpdate)
        if (snapshot !== null) {
            const list = this.listRef.current;
            list.scrollTop = list.scrollHeight - snapshot;
        }
    }
    render() {
        return (
            <ul className="list-group message-list" ref={this.listRef}>
                {this.props.messages.map(msg => {
                    return <Message
                        key={msg.id}
                        message={msg}
                        currentUserId={this.props.currentUser.id}
                    />
                })}
            </ul>
        )
    }
}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired
}

export default MessageList