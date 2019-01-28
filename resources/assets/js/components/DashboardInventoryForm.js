import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {customSelections} from '../Helper';
import Modal from 'react-responsive-modal';

export default class DashboardInventoryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            open: false,
            name: this.props.inventory ? this.props.inventory.name : null
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

    addInventory(el) {
        var self = this;

        $.ajax({
            url: '/api/inventory',
            method: "POST",
            data: $(".inventory-form").serialize(),
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
            self.props.refreshInventories();
            self.props.closePopup();
        });
    }

    updateInventory(id, el) {
        var self = this;

        $.ajax({
            url: '/api/inventory/' + id,
            method: "PUT",
            data: $(".inventory-form").serialize(),
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
            self.props.refreshInventories();
            self.props.closePopup();
        });
    }

    removeInventory(id, el) {
        var self = this;

        el.preventDefault();

        $.ajax({
            url: '/remove-inventory/' + id,
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
        const stock_status = [
            {value: 0, name: "No"},
            {value: 1, name: "Yes"}
        ];

        const tool_types = [
            {value: 'physical_aid', name: "Physical aid"},
            {value: 'service', name: "Service"}
        ];

        var self = this,
            { open } = self.state,
            errors = self.state.errors.map(function(error, i) {
                return (<div key={i}>{error}</div>);
            }),
            all_statuses = stock_status.map(function(status, i) {
                return (<option key={i} value={status.value}>{status.name}</option>)
            }),
            all_types = tool_types.map(function(status, i) {
                return (<option key={i} value={status.value}>{status.name}</option>)
            }),
            all_suppliers = suppliers.map(function(supplier, i) {
                return (<option key={i} value={supplier.id}>{supplier.name}</option>)
            }),
            name,
            cost_price,
            sales_price,
            rental_price,
            stock_lock,
            qty,
            type,
            supplier;

        if (self.props.inventory) {
            name = self.props.inventory.name;
            cost_price = self.props.inventory.cost_price;
            sales_price = self.props.inventory.sales_price;
            rental_price = self.props.inventory.rental_price;
            stock_lock = self.props.inventory.stock_lock;
            qty = self.props.inventory.qty;
            supplier = self.props.inventory.supplier;
            type: "service";
        }

        return (
            <div className="form-content">
                <div className="success-msg">
                    <span>Item {self.props.inventory ? "updated" : "added"}!</span>
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
                        <span className="step-title">Hjælpemidler</span>
                    </div>
                </div>

                <form id="form" className="inventory-form">
                    <div className="left">
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" defaultValue={self.state.name} onChange={self.changeInput.bind(self)}/>
                        </div>
                        <div className="field">
                            <label htmlFor="cost_price">Cost Price</label>
                            <input type="number" name="cost_price" id="cost_price" defaultValue={cost_price} step="0.01"/>
                        </div>
                        <div className="field">
                            <label htmlFor="sales_price">Sales Price</label>
                            <input type="number" name="sales_price" id="sales_price" defaultValue={sales_price} step="0.01"/>
                        </div>
                        <div className="field">
                            <label htmlFor="rental_price">Rental Price</label>
                            <input type="number" name="rental_price" id="rental_price" defaultValue={rental_price} step="0.01"/>
                        </div>
                    </div>
                    <div className="right">
                        <div className="field">
                            <label htmlFor="qty">Quantity</label>
                            <input type="text" name="qty" id="qty" defaultValue={qty}/>
                        </div>
                        <div className="field">
                            <label htmlFor="stock_lock">Stock Lock</label>
                            <select name="stock_lock" id="stock_lock" defaultValue={stock_lock}>
                                {all_statuses}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="supplier_id">Supplier</label>
                            <select name="supplier_id" id="supplier_id" defaultValue={supplier}>
                                {all_suppliers}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="type">Type</label>
                            <select name="type" id="type" defaultValue={type}>
                                {all_types}
                            </select>
                        </div>
                    </div>
                </form>

                <div className="actions edit">
                    <div className="left block">
                        { self.props.inventory ?
                        <span>
                            <span className="remove" onClick={self.onOpenModal.bind(self)}>Remove</span>
                            <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                                <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                                <div className="remove-container">
                                    {"Do you want to remove " + self.props.inventory.name + " ?"}
                                    <div className="buttons">
                                        <button onClick={self.removeInventory.bind(self, self.props.inventory.id)}>Yes</button>
                                        <button onClick={self.onCloseModal.bind(self)} className="no">No</button>
                                    </div>
                                </div>
                            </Modal>
                        </span>
                        : null }
                    </div>
                    <div className="center block"></div>
                    <div className="right block">
                        <span onClick={self.props.inventory ? self.updateInventory.bind(self, self.props.inventory.id) : self.addInventory.bind(self)}>Save</span>
                    </div>
                </div>
            </div>
        );
    }
}
