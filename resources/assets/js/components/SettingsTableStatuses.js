import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';
import SettingsStatusForm from './SettingsStatusForm';
import DashboardTableCitizens from './DashboardTableCitizens';
import {trans} from '../Helper';

export default class SettingsTableStatuses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            openEdit: false,
            selectedStatus: null,
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

    onOpenEditModal(status, el) {
        this.setState({
            selectedStatus: status,
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
            rows;

        if (self.props.statuses.length > 0) {
            rows = self.props.statuses.map(function(status, key) {
                var status_enabled;

                if (status.manual_status_change) {
                    status_enabled = (<img src="/img/success.svg"/>);
                } else {
                    status_enabled = (<img src="/img/no.svg"/>);
                }

                return (<tr key={key} onClick={self.onOpenEditModal.bind(self, status)}>
                            <td>{status.name}</td>
                            <td>{status.order_no}</td>
                            <td>{status.hours}</td>
                            <td className="yes_no">{status_enabled}</td>
                        </tr>);
            });
        }

                // console.log(self.state.statuses);

        return (
            <div className="table">
                <div className="title">{trans('settings', 'statuses')}</div>
                <button className="small" onClick={self.onOpenModal.bind(self)}>{trans('settings', 'add_status')}</button>
                <table id="data-table">
                    <thead>
                        <tr>
                            <td>{trans('settings', 'name')}</td>
                            <td>{trans('settings', 'order_no')}</td>
                            <td>{trans('settings', 'hours')}</td>
                            <td className="yes_no">{trans('settings', 'status')}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>

                <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                    <SettingsStatusForm
                        refreshSettingStatus={self.props.refreshSettingStatus}
                        closePopup={self.onCloseModal.bind(self)}
                    />
                </Modal>
                <Modal open={openEdit} onClose={self.onCloseEditModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseEditModal.bind(self)} className="close-icon"></span>
                    <SettingsStatusForm
                        closePopup={self.onCloseEditModal.bind(self)}
                        refreshSettingStatus={self.props.refreshSettingStatus}
                        status={self.state.selectedStatus} />
                </Modal>
            </div>


    );
    }
}
