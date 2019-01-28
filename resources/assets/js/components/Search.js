import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {trans} from '../Helper';
import { withRouter } from 'react-router';

export default class Search extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			citizens: [],
			communes: []
		};
	}

	search(el)
	{

		let self = this;

		$.ajax({
			url: '/api/search',
			data: {'queue': el.target.value},
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				citizens: resp.data.citizens,
				communes: resp.data.communes
			});
		});

	}

	openCitizensTab()
	{
		console.log('open citizens tab');
	}

	openCommunesTab()
	{
		console.log('open communes tab');
	}

	render()
	{
		let self = this;

		let citizens_li = this.state.citizens.map(function(value, key) {
			return <li onClick={self.openCitizensTab.bind(self)} key={key}>
				{value.name} {value.surname}
			</li>;
		});

		let communes_li = this.state.communes.map(function(value, key) {
			return <li onClick={self.openCommunesTab.bind(self)} key={key}>{value.name} {value.address} </li>;
		});

		return (
			<div className="search">
				<input type="text"
				       placeholder={trans('dashboard', 'search')}
				       onKeyUp={self.search.bind(self)}/>

				<div className="notifications-dropdown ">

					{this.state.citizens.length > 0 ?
						<div className="row">
							<p>Citizens</p>
							<div className="col-sm-12">
								{citizens_li}
							</div>
						</div>
						: ''}

					{this.state.communes.length > 0 ?
						<div className="row">
							<p>Communes</p>
							<div className="col-sm-12">
								{communes_li}
							</div>
						</div>
						: ''}

				</div>
			</div>

		);
	}
}
