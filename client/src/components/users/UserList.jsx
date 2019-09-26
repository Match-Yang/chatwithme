import React, { Component } from 'react'
import PropTypes from "prop-types"
import User from './User'

class UserList extends Component {
    render() {
        return (
            <div className="list-group user-list">
                {this.props.users.map(u => {
                    return <User
                        key={u.id}
                        user={u}
                        {...this.props}
                    >
                    </User>
                })}
            </div>
        )
    }
}

UserList.propTypes = {
    users: PropTypes.array.isRequired,
}

export default UserList