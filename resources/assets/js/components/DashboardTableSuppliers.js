import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DashboardMunicipalityForm from './DashboardMunicipalityForm';
import DashboardProjectsForm from './DashboardProjectsForm';
import Modal from 'react-responsive-modal';
import DashboardSupplierForm from './DashboardSupplierForm';

export default class DashboardTableSuppliers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            openEdit: false,
            selectedSupplier: null,
            suppliers: suppliers
        };

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    }

    componentDidMount()
    {
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

    onOpenEditModal(supplier, el) {
        this.setState({
            selectedSupplier: supplier,
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


        if (typeof self.state.suppliers !== 'undefined' && self.state.suppliers.length > 0) {
            rows = self.props.suppliers.map(function(supplier, id) {
                return (<tr key={id} onClick={self.onOpenEditModal.bind(self, supplier)}>
                            <td>{supplier.name}</td>
                            <td>{supplier.address}</td>
                            <td>{supplier.email}</td>
                            <td>{supplier.mobile}</td>
                        </tr>);
            }),
            table = (<table id="data-table">
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Address</td>
                                <td>Email</td>
                                <td>Mobile</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>);
        }

        return (
            <div className="table">
                <button className="small" onClick={self.onOpenModal.bind(self)}>Add supplier</button>
                <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                    <DashboardSupplierForm
                        refreshSuppliers={self.props.refreshSuppliers}
                        closePopup={self.onCloseModal.bind(self)} />
                </Modal>
                <Modal open={openEdit} onClose={self.onCloseEditModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseEditModal.bind(self)} className="close-icon"></span>
                    <DashboardSupplierForm
                        supplier={self.state.selectedSupplier}
                        closePopup={self.onCloseEditModal.bind(self)}
                        refreshSuppliers={self.props.refreshSuppliers} />
                </Modal>
                {table}
            </div>
        );
    }
}
