import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserList from './UserList'
import UserForm from './UserForm'

export default function UserSection(props) {
    return (
        <div className="container shadow-sm mb-2 user-section">
            <div className="row">
                <div className="col-12 align-self-start">
                    <div className="navbar navbar-dark bg-secondary">
                        <a className="navbar-brand" href="#">Users</a>
                    </div>
                </div>
                <div className="col-12 align-self-start">
                    <UserList {...props} />
                </div>
                <div className="col-12 align-self-end mb-1">
                    <UserForm {...props} />
                </div>
            </div>
        </div>
    )
}

UserSection.propsTypes = {
    users: PropTypes.array.isRequired,
    editUser: PropTypes.func.isRequired
}