import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {customSelections, TextInput} from '../Helper';
import Modal from 'react-responsive-modal';

export default class DashboardMunicipalityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            open: false,
            name: this.props.municipality ? this.props.municipality.name : null,
            surname: this.props.municipality ? this.props.municipality.surname : null,
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

    addMunicipality(el) {
        var self = this;

        $.ajax({
            url: '/commune',
            method: "POST",
            data: $(".municipality-form").serialize(),
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
            self.props.refreshMunicipalities();
            self.props.closePopup();
        });
    }

    updateMunicipality(id, el) {
        var self = this;

        $.ajax({
            url: '/commune/' + id,
            method: "PUT",
            data: $(".municipality-form").serialize(),
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
            self.props.refreshMunicipalities();
            self.props.closePopup();
        });
    }

    removeMunicipality(id, el) {
        var self = this;

        el.preventDefault();

        $.ajax({
            url: '/remove-municipality/' + id,
            method: "POST",
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
                        errors: self.state.errors.concat([item])
                    });
                });

                $(".error-msg").fadeIn();

                self.setState({
                    open: false
                });
            }
        }).done(function(resp) {
            self.setState({
                open: false
            });

            self.props.refreshMunicipalities();
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
        this.setState({
            open: false
        });
    };

    changeInput(name, el) {
        var self = this;

        if (name === "name") {
            self.setState({
                name: $(el.currentTarget).val()
            })
        } else {
            self.setState({
                surname: $(el.currentTarget).val()
            })
        }
    }

    render() {
        const contact_persons = this.props.contactPersons.map(function(value, key){
            return {id: value.id, name:value.name + ' ' + value.surname};
        })

        var self = this,
            { open } = self.state,
            errors = self.state.errors.map(function(error, i) {
                return (<div key={i}>{error}</div>);
            }),
            all_managers = managers.map(function(manager, i) {
                return (<option key={i} value={manager.id}>{manager.name + " " + manager.surname}</option>)
            }),
            // all_statuses = statuses.map(function(status, i) {
            //     return (<option key={i} value={status.id}>{status.name}</option>)
            // }),

            all_contact_persons = contact_persons.map(function(person, i) {
                return (<option key={i} value={person.id}>{person.name}</option>)
            }),
            email,
            name,
            surname,
            address,
            cpr,
            commune,
            pm,
            mobile,
            visitation,
            project_status,
            region,
            bank,
            note,
            maps;

        if (self.props.municipality) {
            email = self.props.municipality.email;
            name = self.props.municipality.name;
            surname = self.props.municipality.surname;
            address = self.props.municipality.address;
            cpr = self.props.municipality.cpr;
            commune = self.props.municipality.commune;
            pm = self.props.municipality.project_manager;
            mobile = self.props.municipality.mobile;
            bank = self.props.municipality.bank_account;
            region = self.props.municipality.region;
            note = self.props.municipality.note;
            maps = "https://maps.google.com/maps?q=" + self.props.municipality.address + "&t=&z=13&ie=UTF8&iwloc=&output=embed"
        }

        return (
            <div className="form-content">
                <div className="success-msg">
                    <span>Municipality {self.props.municipality ? "updated" : "added"}!</span>
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
                        <span className="step-title">Kommune</span>
                    </div>
                </div>

                <form id="form" className="municipality-form">
                    <div className="left">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" name="email" id="email" defaultValue={email}/>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" defaultValue={self.state.name} onChange={self.changeInput.bind(self, "name")}/>
                        </div>
                        <div className="field">
                            <label htmlFor="surname">Surname</label>
                            <input type="text" name="surname" id="surname" defaultValue={self.state.surname} onChange={self.changeInput.bind(self, "surname")}/>
                        </div>
                        <div className="field">
                            <label htmlFor="contact_person">Contact Person</label>
                            <select name="contact_person" id="contact_person">
                                {all_contact_persons}
                            </select>
                        </div>
                    </div>
                    <div className="right">
                        <div>
                            <div className="field">
                                <label htmlFor="project_status">Address</label>
                                <input type="text" name="address" id="address" defaultValue={address}/>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="bank_account">Bank Account</label>
                            <input type="text" name="bank_account" id="bank_account" defaultValue={bank}/>
                        </div>
                        <div className="field">
                            <label htmlFor="region">Region</label>
                            <input type="text" name="region" id="region" defaultValue={region}/>
                        </div>
                        <div className="field">
                            <label htmlFor="region">Note</label>
                            <input type="text" name="note" id="note" defaultValue={note}/>
                        </div>

                    </div>
                    { self.props.municipality ?
                        <div>
                            <div className="maps">
                                <iframe id="gmap_canvas" src={maps}></iframe>
                            </div>
                        </div>
                    : null }
                </form>

                <div className="actions edit">
                    <div className="left block">
                        { self.props.municipality ?
                        <span>
                            <span className="remove" onClick={self.onOpenModal.bind(self)}>Remove</span>
                            <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                                <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                                <div className="remove-container">
                                    {"Do you want to remove " + self.props.municipality.name + " " + self.props.municipality.surname + " ?"}
                                    <div className="buttons">
                                        <button onClick={self.removeMunicipality.bind(self, self.props.municipality.id)}>Yes</button>
                                        <button onClick={self.onCloseModal.bind(self)} className="no">No</button>
                                    </div>
                                </div>
                            </Modal>
                        </span>
                        : null }
                    </div>
                    <div className="center block"></div>
                    <div className="right block">
                        <span onClick={self.props.municipality ? self.updateMunicipality.bind(self, self.props.municipality.id) : self.addMunicipality.bind(self)}>Save</span>
                    </div>
                </div>
            </div>
        );
    }
}
