import React, { Component } from 'react'
import PropTypes from 'prop-types'

class User extends Component {
    render() {
        const { user } = this.props;
        return (
            <a href="#" className="list-group-item list-group-item-action border-0">
                {user.name}
            </a>
        )
    }
}

User.propTypes = {
    user: PropTypes.object.isRequired,
}

export default User