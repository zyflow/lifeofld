import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {customSelections, SelectInput, TextInput, NumberInput} from '../Helper';
import Modal from 'react-responsive-modal';
import {trans} from '../Helper';

export default class SettingsStatusForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            open: false
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

    addStatus(el) {
        var self = this;

        $.ajax({
            url: '/api/project-status-settings',
            method: "POST",
            data: $(".status-form").serialize(),
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
            self.props.refreshSettingStatus();
            self.props.closePopup();
        });
    }

    updateStatus(id, el) {
        var self = this;

        $.ajax({
            url: '/api/project-status-settings/' + id,
            method: "PUT",
            data: $(".status-form").serialize(),
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
            self.props.refreshSettingStatus();
            self.props.closePopup();
        });
    }

    removeStatus(id, el) {
        var self = this;

        el.preventDefault();

        $.ajax({
            url: '/api/project-status-settings/' + id,
            method: "DELETE",
            beforeSend: function(xhr, type) {

                if (!type.crossDomain)
                {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            }
        }).done(function(resp) {
            self.setState({
                open: false
            });

            self.props.refreshSettingStatus();
            self.props.closePopup();
        });
    }

    onOpenModal(el) {
        el.preventDefault();

        this.setState({
            open: true
        });
    };

    onCloseModal(el) {
        this.props.refreshSettingStatus();
        this.setState({
            open: false
        });
    };

    render() {
        var self = this,
            errors,
            { open } = self.state,
            name,
            order_no,
            hours,
            status;

        if (self.props.status) {
            name = self.props.status.name;
            order_no = self.props.status.order_no;
            hours = self.props.status.hours;
            status = self.props.status.manual_status_change;
        }

        return (
            <div className="form-content status-form">
                <div className="success-msg">
                    <span>Status {self.props.status ? "updated" : "added"}!</span>
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
                        <span className="step-title">{trans('settings', 'title')}</span>
                    </div>
                </div>

                <form id="form" className="status-form">
                    <div className="left">
                        <TextInput id="name" value={name} label={trans('settings', 'name')}/>
                        <NumberInput id="order_no" value={order_no} label={trans('settings', 'order_no')}/>
                    </div>
                    <div className="right">
                        <NumberInput id="hours" value={hours} label={trans('settings', 'hours')}/>
                        <div className="field">
                            <label htmlFor="manual_change">{trans('settings', 'status')}</label>
                            <select name="manual_status_change" id="manual_status_change" defaultValue={status}>
                                <option value="1">{trans('settings', 'yes')}</option>
                                <option value="0">{trans('settings', 'no')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="info">{trans('settings', 'info')}</div>
                </form>

                <div className="actions edit">
                    <div className="left block">
                        { self.props.status ?
                            <span>
                            <span className="remove" onClick={self.onOpenModal.bind(self)}>{trans('settings', 'remove')}</span>
                            <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                                <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                                <div className="remove-container">
                                    {trans('settings', 'remove_text')} {self.props.status.name} ?
                                    <div className="buttons">
                                        <button onClick={self.removeStatus.bind(self, self.props.status.id)}>{trans('settings', 'yes')}</button>
                                        <button onClick={self.onCloseModal.bind(self)} className="no">{trans('settings', 'no')}</button>
                                    </div>
                                </div>
                            </Modal>
                        </span>
                            : null }
                    </div>
                    <div className="center block"></div>
                    <div className="right block">
                        <span onClick={self.props.status ? self.updateStatus.bind(self, self.props.status.id) : self.addStatus.bind(self)}>{trans('settings', 'save')}</span>
                    </div>
                </div>
            </div>
        );
    }
}
