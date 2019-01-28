import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {counterEffect} from '../Helper';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {trans} from '../Helper';

export default class DashboardCounters extends Component {
	constructor(props)
	{
		super(props);

		this.state = {
			activeData: "all",
			all_opened: null,
			liggetid_sum: null,
			meeting_days: null,
		    count_open_cases: 0,
		    count_lying_time_in_days: 0,
		    count_days_between_first_contract: 0,
		    count_dd_visitations: 0,
		    count_closed_cases: 0,

		    count_user_open_cases: 0,
		    count_user_lying_tim_in_days: 0,
		    count_user_days_between_first_contract: 0,
		    count_user_dd_visitations: 0,
		    count_user_closed_cases: 0,
			startDate: new Date()
		};

		this.handleChange = this.handleChange.bind(this);

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

	}

	handleChange(date) {
		this.setState({
			startDate: date
		});
	}

	componentDidMount()
	{
		var self = this;

		$.ajax({
			url: '/dashboard-counter',
			method: "GET",
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				all_opened: resp.opened,
				liggetid_sum: resp.liggetid,
				meeting_days: resp.meeting_days
			});

			counterEffect();
		});
	}

	switchData(active, el)
	{
		var self = this;

		self.setState({
			activeData: active
		});
	}

	updateCounters()
	{
		console.log(" needed updat ");
	}

	render()
	{
		var self = this;

		return (
			<div className="counters">
				<div className="group">
					<div className="tabs">
						<div className={self.state.activeData === "all" ? "tab active" : "tab"}
						     onClick={self.switchData.bind(self, "all")}>bi data all users
						</div>
						<div className={self.state.activeData === "login" ? "tab active" : "tab"}
						     onClick={self.switchData.bind(self, "login")}>bi data login users
						</div>
					</div>
					<div className="form-content">
						<form id="counter-date-form" onChange={self.updateCounters.bind(self)}>
							<div className="tabs">
								<div className="field">
									<DatePicker
										selected={this.state.startDate}
										onChange={this.handleChange}
									/>
								</div>
							</div>
						</form>
					</div>
				</div>

				{self.state.activeData === "all" ?
					<div className="counter-block">
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'open_cases_count')}</div>
							<div className="number">{self.state.all_opened}</div>
						</div>
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'open_case_laying_time')}</div>
							<div className="number">{self.state.liggetid_sum}</div>
						</div>
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'days_between_contact_meeting')}</div>
							<div className="number">{self.state.meeting_days}</div>
						</div>
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'number_of_visits_since_last_dd')}</div>
							<div className="number">25</div>
						</div>
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'number_of_closed_cases_last_30_days')}</div>
							<div className="number">478</div>
						</div>
					</div> : null}

				{self.state.activeData === "login" ?
					<div className="counter-block">
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'bi_number_of_open_cases')}</div>
                            <div className="number">{this.state.count_user_open_cases}</div>
						</div>
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'bi_total_laying_time')}</div>
                            <div className="number">-33</div>
						</div>
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'bi_days_between_contact_meeting')}</div>
                            <div className="number">{this.state.count_user_days_between_first_contract}</div>
						</div>
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'bi_number_of_visits_from_dd')}</div>
                            <div className="number">{this.state.count_user_dd_visitations}</div>
						</div>
						<div className="counter">
							<div className="title">{trans('dashboard_counter', 'bi_number_of_closed_cases_last_30_days')}</div>
                            <div className="number">{this.state.count_user_closed_cases}</div>
						</div>
					</div> : null}
			</div>
		);
	}
}
