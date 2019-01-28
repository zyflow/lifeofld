import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DashboardCitizenForm from './DashboardCitizenForm';
import Modal from 'react-responsive-modal';
import {trans} from '../Helper';

export default class DashboardTableCitizens extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openEdit: false,
            selectedCitizen: null,
            managers: [],
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

    onOpenEditModal(citizen, el) {
        this.setState({
            selectedCitizen: citizen,
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

        if (self.props.citizens.length > 0 && self.props.municipalities.length > 0) {
            rows = self.props.citizens.map(function(citizen, id) {
                var have_project;

                if (citizen.have_project === 1) {
                    have_project = (<img src="/img/success.svg"/>);
                } else {
                    have_project = (<img src="/img/no.svg"/>);
                }

                return (<tr key={id} onClick={self.onOpenEditModal.bind(self, citizen)} className={citizen.status}>
                            <td id={citizen.id}>{citizen.name}</td>
                            <td>{citizen.surname}</td>
                            <td>*****</td>
                            <td>{citizen.address}</td>
                            <td>{citizen.email}</td>
                            <td>{citizen.mobile}</td>
                            <td className="yes_no">{have_project}</td>
                        </tr>);
            }),
            table = (<table id="data-table">
                        <thead>
                            <tr>
                                <td>{trans('citizens', 'name')}</td>
                                <td>{trans('citizens', 'surname')}</td>
                                <td>{trans('citizens', 'cpr')}</td>
                                <td>{trans('citizens', 'address')}</td>
                                <td>{trans('citizens', 'email')}</td>
                                <td>{trans('citizens', 'mobile')}</td>
                                <td className="yes_no">{trans('citizens', 'have_project')}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>);
        }

        return (
            <div className="table">
                <button className="small" onClick={self.onOpenModal.bind(self)}>Tilføj Borger</button>
                <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                    <DashboardCitizenForm
                        refreshMunicipalities={self.props.refreshMunicipalities}
                        managers={self.state.managers}
                        refreshCitizens={self.props.refreshCitizens}
                        closePopup={self.onCloseModal.bind(self)}
                        citizens={self.props.citizens}
                        municipalities={self.props.municipalities} />
                </Modal>
                <Modal open={openEdit} onClose={self.onCloseEditModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseEditModal.bind(self)} className="close-icon"></span>
                    <DashboardCitizenForm
                        citizen={self.state.selectedCitizen}
                        managers={self.state.managers}
                        citizens={self.state.citizens}
                        refreshCitizens={self.props.refreshCitizens}
                        closePopup={self.onCloseEditModal.bind(self)}
                        municipalities={self.props.municipalities} />
                </Modal>
                {table}
            </div>
        );
    }
}
