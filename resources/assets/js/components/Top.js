import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Search from './Search';
import Notification from './Notification';
import DashboardProjectsForm from './DashboardProjectsForm';

export default class Top extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date_notifications: [],
            notifications: []
        };

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    }

    search(el)
    {
        var input = $(el.currentTarget),
            table = $('#data-table').DataTable();

        $(input).keyup(function() {
            table.search(input.val()).draw();
        });
    }

    render() {
        var self = this,
            avatar;

        if (user.image) {
            avatar = "/storage/avatars/" + user.image;
        } else {
            avatar = "/img/no-avatar.jpg";
        }

        return (
            <div className="top">
                <Search />
                <div className="top-right">
                    <Notification />
                    <div className="user">
                        <div className="name">{user.name}</div>
                        <div className="avatar" style={{ backgroundImage: 'url(' + avatar + ')' }}></div>
                    </div>
                    <div className="logout">
                        <a href="/logout"><img src="/img/logout.svg"/></a>
                    </div>
                </div>
            </div>
        );
    }
}
