import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import UsersForm from './UsersForm';
import Modal from 'react-responsive-modal';

export default class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openEdit: false,
            selectedUser: null
        };

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    }

    onOpenModal(el) {
        this.setState({
            open: true
        });
    };

    onCloseModal(el) {
        this.setState({
            open: false
        });
    };

    onOpenEditModal(user, el) {
        this.setState({
            selectedUser: user,
            openEdit: true
        });
    };

    onCloseEditModal(el) {
        this.setState({
            openEdit: false
        });
    };

    render() {
        var self = this,
            { open, openEdit } = self.state,
            rows,
            table;

        if (self.props.users.length > 0) {
            rows = self.props.users.map(function(user, id) {
                var avatar;

                if (user.image) {
                    avatar = "/storage/avatars/" + user.image;
                } else {
                    avatar = "/img/no-avatar.jpg";
                }

                return (<tr key={id} onClick={self.onOpenEditModal.bind(self, user)}>
                            <td id={user.id}><div className="avatar" style={{ backgroundImage: 'url(' + avatar + ')' }}></div></td>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>);
            }),
            table = (<table id="data-table">
                        <thead>
                            <tr>
                                <td className="avatar-cell"></td>
                                <td>Name</td>
                                <td>Surname</td>
                                <td>Username</td>
                                <td>E-mail</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>)
        }

        return (
            <div className="table">
                <button className="small" onClick={self.onOpenModal.bind(self)}>Add User</button>
                <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                    <UsersForm
                        refreshUsers={self.props.refreshUsers}
                        closePopup={self.onCloseModal.bind(self)} />
                </Modal>
                <Modal open={openEdit} onClose={self.onCloseEditModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseEditModal.bind(self)} className="close-icon"></span>
                    <UsersForm
                        user={self.state.selectedUser}
                        closePopup={self.onCloseEditModal.bind(self)}
                        refreshUsers={self.props.refreshUsers}/>
                </Modal>
                {table}
            </div>
        );
    }
}
