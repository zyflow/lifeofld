import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DashboardMunicipalityForm from './DashboardMunicipalityForm';
import Modal from 'react-responsive-modal';
import {trans} from '../Helper';

export default class DashboardTableMunicipalities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openEdit: false,
            selectedMunicipality: null,
            contactPersons: []
        };

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    }

    componentDidMount()
    {
        this.getContactPersonList();
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

    onOpenEditModal(municipality, el) {
        this.setState({
            selectedMunicipality: municipality,
            openEdit: true
        });
    };

    onCloseEditModal(el) {
        this.setState({
            openEdit: false
        });
    };

    getContactPersonList()
    {
        let self = this;

        $.ajax({
            url: '/contact-person',
            beforeSend: function(xhr, type) {

                if (!type.crossDomain) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            }
        }).done(function(resp) {
            self.setState({
                contactPersons: resp.contact_persons
            })
        });
    }


    render() {
        var self = this,
            { open, openEdit } = self.state,
            rows,
            table;


        if (self.props.municipalities.length > 0) {
            rows = self.props.municipalities.map(function(municipality, id) {
                return (<tr key={id} onClick={self.onOpenEditModal.bind(self, municipality)}>
                            <td id={municipality.id}>{municipality.name}</td>
                            <td>{municipality.surname}</td>
                            <td>{municipality.address}</td>
                            <td>{municipality.email}</td>
                            <td>{municipality.notes}</td>
                            <td>{municipality.open_projects_count}</td>
                        </tr>);
            }),
            table = (<table id="data-table">
                        <thead>
                            <tr>
                                <td>{trans('commune', 'name')}</td>
                                <td>{trans('commune', 'surname')}</td>
                                <td>{trans('commune', 'address')}</td>
                                <td>{trans('commune', 'email')}</td>
                                <td>{trans('commune', 'notes')}</td>
                                <td>{trans('commune', 'have_project')}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>);
        }

        return (
            <div className="table">
                <button className="small" onClick={self.onOpenModal.bind(self)}>Tilføj Kommune</button>
                <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                    <DashboardMunicipalityForm
                        contactPersons={self.state.contactPersons}
                        refreshMunicipalities={self.props.refreshMunicipalities}
                        closePopup={self.onCloseModal.bind(self)} />
                </Modal>
                <Modal open={openEdit} onClose={self.onCloseEditModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseEditModal.bind(self)} className="close-icon"></span>
                    <DashboardMunicipalityForm
                        contactPersons={self.state.contactPersons}
                        municipality={self.state.selectedMunicipality}
                        closePopup={self.onCloseEditModal.bind(self)}
                        refreshMunicipalities={self.props.refreshMunicipalities} />
                </Modal>
                {table}
            </div>
        );
    }
}
