import React, {Component} from 'react';
import Modal from 'react-responsive-modal';
import {trans} from '../Helper';

export default class DashboardSupplierForm extends Component {
	constructor(props)
	{
		super(props);

		this.state = {
			errors: [],
			open: false
			// citizenList: this.props.citizens,
			// name: this.props.municipality ? this.props.municipality.name : null,
			// surname: this.props.municipality ? this.props.municipality.surname : null,
		};

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

	}

	componentDidMount() {}

	onOpenModal(el)
	{
		el.preventDefault();

		this.setState({
			open: true
		});
	};

	onCloseModal(el)
	{
		this.setState({
			open: false
		});
	};

	addSupplier(el) {
		var self = this;

		$.ajax({
			url: '/api/supplier',
			method: "POST",
			data: $(".supplier-form").serialize(),
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
			self.props.refreshSuppliers();
			self.props.closePopup();
		});
	}

	updateSupplier(id, el) {
		var self = this;

		$.ajax({
			url: '/api/supplier/' + id,
			method: "PUT",
			data: $(".supplier-form").serialize(),
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
			self.props.refreshSuppliers();
			self.props.closePopup();
		});
	}

	removeSupplier(id, el) {
		var self = this;

		el.preventDefault();

		$.ajax({
			url: '/api/supplier/' + id,
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

			self.props.refreshSuppliers();
			self.props.closePopup();
		});
	}

	render()
	{

		var self   = this,
		    {open} = self.state,
		    supplierName,
		    address,
		    email,
		    mobile,
		    errors = self.state.errors.map(function(error, i) {
			    return (<div key={i}>{error}</div>);
		    });

		if (self.props.supplier)
		{
			supplierName = self.props.supplier.name;
			address = self.props.supplier.address;
			email = self.props.supplier.email;
			mobile = self.props.supplier.mobile;
		}


		return (
			<div className="form-content">
				<div className="success-msg">
					<span>Municipality {self.props.supplier ? "updated" : "added"}!</span>
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
						<span className="step-title">Supplier</span>
					</div>
				</div>

				<form id="form" className="supplier-form">
					<div className="left">
						<div className="field">
							<label htmlFor="name">{trans('supplier', 'name')}</label>
							<input type="text" name="name" id="name" defaultValue={supplierName}/>
						</div>

						<div className="field">
							<label htmlFor="email">{trans('supplier', 'email')}</label>
							<input type="text" name="email" id="email" defaultValue={email}/>
						</div>
					</div>
					<div className="right">
						<div className="field">
							<label htmlFor="address">{trans('supplier', 'address')}</label>
							<input type="text" name="address" id="address" defaultValue={address}/>
						</div>

						<div className="field">
							<label htmlFor="mobile">{trans('supplier', 'mobile')}</label>
							<input type="text" name="mobile" id="mobile" defaultValue={mobile}/>
						</div>


					</div>

				</form>

				<div className="actions edit">
					<div className="left block">
						{self.props.supplier ?
							<span>
                            <span className="remove" onClick={self.onOpenModal.bind(self)}>Remove</span>
                            <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                                <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                                <div className="remove-container">
                                    {"Do you want to remove " + self.props.supplier.name}
	                                <div className="buttons">
                                        <button onClick={self.removeSupplier.bind(self, self.props.supplier.id)}>Yes</button>
		                                <button onClick={self.onCloseModal.bind(self)} className="no">No</button>
                                    </div>
                                </div>
                            </Modal>
                        </span>
							: null}
					</div>
					<div className="center block"></div>
					<div className="right block">
						<span onClick={self.props.supplier ? self.updateSupplier.bind(self, self.props.supplier.id) : self.addSupplier.bind(self)}>Save</span>
					</div>
				</div>
			</div>
		);
	}
}
