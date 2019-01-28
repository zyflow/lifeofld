import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DashboardInventoryForm from './DashboardInventoryForm';
import Modal from 'react-responsive-modal';

export default class DashboardTableInventories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openEdit: false,
            selectedInventory: null
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

    onOpenEditModal(inventory, el) {
        this.setState({
            selectedInventory: inventory,
            openEdit: true
        });
    };

    onCloseEditModal(el) {
        this.setState({
            openEdit: false
        });
    };

    render() {
        const stock_status = [
            {value: 0, name: "No"},
            {value: 1, name: "Yes"}
        ];

        var self = this,
            { open, openEdit } = self.state,
            rows,
            table;

        if (self.props.inventories.length > 0) {
            rows = self.props.inventories.map(function(inventory, id) {
                var price;

                if (inventory.sales_price && inventory.sales_price < inventory.cost_price) {
                    price = <div className="price sales"><span className="regular">{inventory.cost_price} DKK</span> <span className="sales">{inventory.sales_price} DKK</span></div>;
                } else {
                    price = <div className="price"><span className="regular">{inventory.cost_price} DKK</span></div>;
                }

                return (<tr key={id} onClick={self.onOpenEditModal.bind(self, inventory)}>
                            <td id={inventory.id}>{inventory.id}</td>
                            <td>{inventory.name}</td>
                            <td>{price}</td>
                            <td>{inventory.rental_price} DKK</td>
                            <td>{inventory.qty}</td>
                            <td>{_.find(stock_status, function (status) { return status.value === inventory.stock_lock; }).name}</td>
                            <td>{inventory.type}</td>
                </tr>);
            }),
            table = (<table id="data-table">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Name</td>
                                <td>Cost Price</td>
                                <td>Rental Price</td>
                                <td>Quantity</td>
                                <td>Stock Lock</td>
                                <td>Type</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>);
        };

        return (
            <div className="table">
                <button className="small" onClick={self.onOpenModal.bind(self)}>Tilføj Hjælpemidler</button>
                <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                    <DashboardInventoryForm
                        closePopup={self.onCloseModal.bind(self)}
                        refreshInventories={self.props.refreshInventories} />
                </Modal>
                <Modal open={openEdit} onClose={self.onCloseEditModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseEditModal.bind(self)} className="close-icon"></span>
                    <DashboardInventoryForm
                        inventory={self.state.selectedInventory}
                        closePopup={self.onCloseEditModal.bind(self)}
                        refreshInventories={self.props.refreshInventories} />
                </Modal>
                {table}
            </div>
        );
    }
}
