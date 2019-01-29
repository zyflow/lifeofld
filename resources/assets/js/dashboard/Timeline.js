import React, {Component} from 'react';
import Menu from '../components/Menu';
import Top from '../components/Top';
import DashboardCounters from '../components/DashboardCounters';
import DashboardTableCitizens from '../components/DashboardTableCitizens';
import DashboardTableMunicipalities from '../components/DashboardTableMunicipalities';
import DashboardTableInventories from '../components/DashboardTableInventories';
import DashboardTableProjects from '../components/DashboardTableProjects';
import {dataTables} from '../Helper';
import 'datatables';
import {trans} from '../Helper';
import DashboardTableSuppliers from '../components/DashboardTableSuppliers';

export default class Dashboard extends Component {
	constructor(props)
	{
		console.log('timeline ');
		super(props);

		this.state = {
			activeFilter: "borgere",
			citizens: [],
			municipalities: [],
			inventories: [],
			suppliers: [],
			projects: [],
			translations: translations,
			projectStatusSettings: []
		};
	}

	componentDidMount()
	{
		var self = this;

		self.getProjectSettings();
		self.getMunicipalities();
		self.getCitizens();
		self.getInventories();
		self.getProjects();
		self.getSuppliers();
	}

	getProjects(el)
	{
		var self = this;

		$.ajax({
			url: '/project',
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				projects: resp.projects
			});
		});
	}

	getMunicipalities(el)
	{
		var self = this;

		$.ajax({
			url: '/commune',
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				municipalities: resp.municipalities
			});
		});
	}

	getCitizens(el)
	{
		var self = this;

		$.ajax({
			url: '/api/citizen',
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				citizens: resp.citizens
			});
		});
	}

	getInventories(el)
	{
		var self = this;

		$.ajax({
			url: '/api/inventory',
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				inventories: resp.inventories
			});
		});
	}

	getSuppliers(el)
	{
		var self = this;

		$.ajax({
			url: '/api/supplier',
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {

			self.setState({
				suppliers: resp.suppliers
			});
		});
	}


	getTranslations(el)
	{
		var self = this;

		$.ajax({
			url: '/translations/get/' + locale,
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				translations: resp.test
			});
		});
	}

	getProjectSettings()
	{
		let self = this;

		$.ajax({
			url: '/api/project-status-settings',
			beforeSend: function(xhr, type) {

				if (!type.crossDomain) {
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				projectStatusSettings: resp.projectStatusSettings
			});
		});
	}


	componentDidUpdate()
	{
		dataTables();
	}

	switchFilter(active, el)
	{
		var self = this;

		self.setState({
			activeFilter: active
		});
	}

	render()
	{
		var self = this;


		return (
			<div className="dashboard-container">
				<Menu/>
				<div className="right-content">
					<Top citizens={citizens}/>
					<div className="main-container">
						<div className="mobile-title">{document.title.split(" | ")[0]}</div>
						<div className="filters">
							<button className={self.state.activeFilter === "borgere" ? "active" : null}
							        onClick={self.switchFilter.bind(self, "borgere")}>{trans('dashboard', 'citizens')}</button>
							<button className={self.state.activeFilter === "kommuner" ? "active" : null}
							        onClick={self.switchFilter.bind(self, "kommuner")}>{trans('dashboard', 'commune')}</button>
						</div>
						<DashboardCounters/>
						{self.state.activeFilter === "borgere" ?
							<DashboardTableCitizens
								refreshMunicipalities={self.getMunicipalities.bind(self)}
								refreshCitizens={self.getCitizens.bind(self)}
								citizens={self.state.citizens}
								municipalities={self.state.municipalities}/>
							: null}
						{self.state.activeFilter === "kommuner" ?
							<DashboardTableMunicipalities
								municipalities={self.state.municipalities}
								refreshMunicipalities={self.getMunicipalities.bind(self)}/>
							: null}
						{self.state.activeFilter === "projekter" ?
							<DashboardTableProjects
								// refreshMunicipalities={self.getMunicipalities.bind(self)}
								refreshCitizens={self.getCitizens.bind(self)}
								// municipalities={self.state.municipalities}
								refreshProjects={self.getProjects.bind(self)}
								refreshProjectSettings={self.getProjectSettings.bind(self)}
								projects={self.state.projects}
								projectStatusSettings={self.state.projectStatusSettings}
								citizens={self.state.citizens}
								municipalities={self.state.municipalities}
							/>
							: null}
						{self.state.activeFilter === "hjælpemidler" ?
							<DashboardTableInventories
								inventories={self.state.inventories}
								refreshInventories={self.getInventories.bind(self)}/>
							: null}

						{/*{console.log('stateeee',self.state)}*/}
						{self.state.activeFilter === "suppliers" ?
							<DashboardTableSuppliers
								refreshSuppliers={self.getSuppliers.bind(self)}
								suppliers={self.state.suppliers}
								citizens={self.state.citizens}
							/>
							: null}
					</div>
				</div>
			</div>
		);
	}
}
