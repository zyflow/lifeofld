import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Menu from '../components/Menu';
import Top from '../components/Top';
import UsersTable from '../components/UsersTable';

export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        var self = this;

        self.getUsers();
    }

    getUsers(el) {
        var self = this;

        $.ajax({
            url: '/api/user',
            beforeSend: function(xhr, type) {

                if (!type.crossDomain) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            }
        }).done(function(resp) {
            self.setState({
                users: resp.users
            })
        });
    }

    render() {
        var self = this;

        return (
            <div className="dashboard-container">
                <Menu />
                <div className="right-content">
                    <Top citizens={citizens} />
                    <div className="main-container">
                        <div className="mobile-title">{ document.title.split(" | ")[0] }</div>
                        <UsersTable
                            users={self.state.users}
                            refreshUsers={self.getUsers.bind(self)} />
                    </div>
                </div>
            </div>
        );
    }
}
