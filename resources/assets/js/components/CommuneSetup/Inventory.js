import React, {Component} from 'react';

export default class Inventory extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			inventories: this.props.inventories,
			selectedKommuneID: this.props.selectedCommuneID
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot)
	{
		if (prevProps.inventories !== this.props.inventories)
		{
			this.setState({
				inventories: this.props.inventories
			});
		}
	}

	updateInventoryName(id)
	{
		var self = this;

		let fd = new FormData($(".inventories-form")[0]);
		fd.append('kommune_id', self.props.selectedCommuneID);

		// console.log(fd);
		$.ajax({
			url: '/api/commune-setup',
			method: "POST",
			data: fd,
			processData: false,
			contentType: false,
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			},
			error: function(data) {
				self.setState({
					errors: []
				});

				$.each(data.responseJSON.errors, function(key, item) {
					self.setState({
						errors: self.state.errors.concat([item[0]])
					});
				});

				$(".error-msg").fadeIn();
			}
		}).done(function(resp) {
			// self.props.refreshInventories();
			// self.props.closePopup();
		});
	}

	handleSubmit(e)
	{
		let self = this;
		e.preventDefault();
		self.updateInventoryName();
	}

	handleCommuneNameChange(inventoryID, e)
	{
		let self = this;

		let temp = self.state.inventories;
		temp[inventoryID].inventory_name.name = e.target.value;

		inventories: temp;

		this.setState({
			inventories: temp
		});
	}

	handlePriceChange(key, e)
	{
		let self = this;
		// console.log('e? ', self.state.inventories);

		let temp = self.state.inventories;

		if (temp[key].inventory_prices === null)
		{
			temp[key].inventory_prices = {price: 0};
		}

		let inventoryPriceObj = temp[key].inventory_prices;

		inventoryPriceObj.price = e.target.value;

		inventories: temp;

		console.log(inventories);
		this.setState({
			inventories: temp
		});
	}

	render()
	{
		let self = this;
		let rows = self.state.inventories.map(function(value, key) {
			// console.log(value);
			let inventoryName = '';

			if (value.inventory_name !== null)
			{
				inventoryName = value.inventory_name.name;
			}

			let price = value.sales_price;

			let communePrice = price;

			if (value.inventory_prices !== null)
			{
				communePrice = value.inventory_prices.price;
			}

			let inventoryFieldName = value.id + "[" + 'inventoryName' + "]";
			let priceFieldName = value.id + "[" + 'price' + "]";

			return (
				<tr key={value.id}>
					<td id={value.id}>{value.name}</td>
					<td>
						<div className="col-xs-3">
							<input type="text" name={inventoryFieldName}
							       className="input-sm"
							       value={inventoryName}
							       onChange={self.handleCommuneNameChange.bind(self, key)}
							/>
						</div>
					</td>
					<td>
						<input type="number " name={priceFieldName}
						       className="form-control input-sm"
						       value={communePrice}
						       onChange={self.handlePriceChange.bind(self, key)}
						/>
					</td>
					<td>{value.sales_price}</td>
				</tr>
			);
		});

		return <div>
			<p>Inventory Names</p>
			<form action="#" method="POST" className="inventories-form">
				<table id="data-table" className='inventories'>
					<thead>
					<tr>
						<td width="35%">Key</td>
						<td width="35%">Kommune defined name</td>
						<td width="25%">Price</td>
						<td width="5%">Original Price</td>
					</tr>
					</thead>
					<tbody>
					{rows}
					</tbody>
				</table>
			</form>

			<button onClick={this.handleSubmit.bind(self)}>
				Save
			</button>
		</div>;
	}
}
