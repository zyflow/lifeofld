import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {customSelections} from '../Helper';
import Modal from 'react-responsive-modal';

export default class UsersForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            open: false,
            name: this.props.user ? this.props.user.name : null
        };

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    }

    componentDidMount() {
        customSelections();
    }

    addUser(el) {
        var self = this;

        el.preventDefault();

        $.ajax({
            url: '/save-user',
            method: "POST",
            processData: false,
            contentType: false,
            data: new FormData($(".user-form")[0]),
            beforeSend: function(xhr, type) {

                if (!type.crossDomain) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            },
            error: function (data) {
                self.setState({
                    errors: []
                });

                $.each(data.responseJSON.errors, function (key, item) {
                    self.setState({
                        errors: self.state.errors.concat([item[0]])
                    });
                });

                $(".error-msg").fadeIn();
            }
        }).done(function(resp) {
            self.props.refreshUsers();
            self.props.closePopup();
        });
    }

    updateUser(id, el) {
        var self = this;

        el.preventDefault();

        let fd = new FormData($(".user-form")[0]);
        fd.append("_method", 'put');

        $.ajax({
            url: '/api/user/' + id,
            method: "POST",
            data: fd,
            processData: false,
            contentType: false,
            beforeSend: function(xhr, type) {

                if (!type.crossDomain) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            },
            error: function (data) {
                self.setState({
                    errors: []
                });

                $.each(data.responseJSON.errors, function (key, item) {
                    self.setState({
                        errors: self.state.errors.concat([item[0]])
                    });
                });

                $(".error-msg").fadeIn();
            }
        }).done(function(resp) {
            self.props.refreshUsers();
            self.props.closePopup();
        });
    }

    removeUser(id, el) {
        var self = this;

        el.preventDefault();

        $.ajax({
            url: '/remove-user/' + id,
            method: "POST",
            beforeSend: function(xhr, type) {

                if (!type.crossDomain) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            },
        }).done(function(resp) {
            self.setState({
                open: false
            });

            self.props.closePopup();

            $("#data-table").find("#" + id).parent().remove();
        });
    }

    onOpenModal(el) {
        el.preventDefault();

        this.setState({
            open: true
        });
    };

    onCloseModal(el) {
        this.setState({
            open: false
        });
    };

    changeInput(el) {
        var self = this;

        self.setState({
            name: $(el.currentTarget).val()
        })
    }

    render() {
        var self = this,
            { open } = self.state,
            errors = self.state.errors.map(function(error, i) {
                return (<div key={i}>{error}</div>);
            }),
            email,
            name,
            surname,
            username,
            password,
            password_confirmation,
            avatar;

        if (self.props.user) {
            email = self.props.user.email;
            name = self.props.user.name;
            surname = self.props.user.surname;
            username = self.props.user.username;
            password = self.props.user.password;

            if (self.props.user.image) {
                avatar = "/storage/avatars/" + self.props.user.image;
            } else {
                avatar = "/img/no-avatar.jpg";
            }
        }

        return (
            <div className="form-content">
                <div className="success-msg">
                    <span>User {self.props.user ? "updated" : "added"}!</span>
                    <span><img src="/img/success.svg"/></span>
                </div>

                <div className="error-msg">
                    <div className="errors">
                        <img src="/img/warning.svg"/>
                        <span>{errors}</span>
                    </div>
                </div>

                <div className="steps">
                    <div className="step active">
                        <span className="step-title">User</span>
                    </div>
                </div>

                <form id="form" className="user-form" encType="multipart/form-data">
                    <div className="left">
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" defaultValue={name} onChange={self.changeInput.bind(self)}/>
                        </div>
                        <div className="field">
                            <label htmlFor="surname">Surname</label>
                            <input type="text" name="surname" id="surname" defaultValue={surname} />
                        </div>

                        <div className="field">
                            <label htmlFor="email">E-Mail</label>
                            <input type="email" name="email" id="email" defaultValue={email}/>
                        </div>
                        <div className="field">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" id="username" defaultValue={username}/>
                        </div>
                    </div>
                    <div className="right">
                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" defaultValue={password}/>
                        </div>
                        <div className="field">
                            <label htmlFor="password_confirmation">Password Confirmation</label>
                            <input type="password" name="password_confirmation" id="password_confirmation" defaultValue={password}/>
                        </div>
                        <div className="field">
                            <label htmlFor="image">Avatar</label>
                            <input type="file" name="image" id="image" accept="image/*"/>
                        </div>
                    </div>
                </form>

                <div className="actions edit">
                    <div className="left block">
                        { self.props.user ?
                        <span>
                            <span className="remove" onClick={self.onOpenModal.bind(self)}>Remove</span>
                            <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                                <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                                <div className="remove-container">
                                    {"Do you want to remove " + self.props.user.name + " ?"}
                                    <div className="buttons">
                                        <button onClick={self.removeUser.bind(self, self.props.user.id)}>Yes</button>
                                        <button onClick={self.onCloseModal.bind(self)} className="no">No</button>
                                    </div>
                                </div>
                            </Modal>
                        </span>
                        : null }
                    </div>
                    <div className="center block"></div>
                    <div className="right block">
                        <span onClick={self.props.user ? self.updateUser.bind(self, self.props.user.id) : self.addUser.bind(self)}>Save</span>
                    </div>
                </div>
            </div>
        );
    }
}
