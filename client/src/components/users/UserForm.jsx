import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default function UserForm(props) {
    function onSubmit(e) {
        e.preventDefault();
        const node = e.currentTarget.elements.user;
        const userName = node.value;
        props.editUser(userName);
        node.value = "";
    }
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                className="form-control"
                placeholder="Set Your Name"
                name="user"
            />
        </form>
    )
}

UserForm.propTypes = {
    editUser: PropTypes.func.isRequired
}