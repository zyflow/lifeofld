import React, {Component} from 'react';
import DatePicker from 'react-datepicker';

export default class DashboardProjectsFormStatus extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			status_date: props.displayDate
		};
	}

	componentDidMount() {
		// this.setState
	}

	StatusField(props)
	{
		let project_status_settings_order_no = 0;
		let next_order_no = 0;
		let manual_status_change = 0;
		let status_name = '';
		let next_status = {};

		if (props.project && props.project.status_settings)
		{
			project_status_settings_order_no = parseInt(props.project.status_settings.order_no);
			next_order_no = project_status_settings_order_no + 1;
			manual_status_change = props.project.status_settings.manual_status_change;
			status_name = props.project.status_settings.name;
		}

		const projectStatusSettings = this.props.project_status_settings;

		let currentStatusSettings = [];
		let highestStatusNo = 0;

		const all_statuses = projectStatusSettings.map(function(status, i) {

			if (status.order_no > highestStatusNo)
			{
				highestStatusNo = status.order_no;
			}

			if (next_order_no === status.order_no)
			{
				next_status = status;
				return (<option key={i} value={status.id}>{status.name}</option>);
			}
		});

		if (highestStatusNo === project_status_settings_order_no)
		{
			return '';
		}


	}

	handleChange(date, date2)
	{
		this.setState({
			status_date: date
		});
	}

	render()
	{
		let self = this;
		let project_status_settings_order_no = 0;
		let next_order_no = 0;
		let manual_status_change = 0;
		let status_name = '';
		let next_status = {};

		if (self.props.project && self.props.project.status_settings)
		{
			project_status_settings_order_no = parseInt(self.props.project.status_settings.order_no);
			next_order_no = project_status_settings_order_no + 1;
			manual_status_change = self.props.project.status_settings.manual_status_change;
			status_name = self.props.project.status_settings.name;
		}


		const projectStatusSettings = self.props.project_status_settings;

		let currentStatusSettings = [];
		let highestStatusNo = 0;

		const all_statuses = projectStatusSettings.map(function(status, i) {

			if (status.order_no > highestStatusNo)
			{
				highestStatusNo = status.order_no;
			}

			if (next_order_no === status.order_no)
			{
				next_status = status;
				return (<option key={i} value={status.id}>{status.name}</option>);
			}
		});

		if (highestStatusNo === project_status_settings_order_no)
		{
			return '';
		}


		if (manual_status_change === 1)
		{
			return <div className="field">
				<label htmlFor="project_status_settings_id">Status: {status_name}</label>
				<select name="project_status_settings_id" id="project_status_settings_id">
					{all_statuses}
				</select>
			</div>;
		}

		return <div className="field">
			<label htmlFor="project_status">Status {status_name}</label>
			<input type="hidden" name="project_status_settings_id" value={next_status.id}/>

			<DatePicker
				selected={self.state.status_date}
				name="date"
				id="date"
				dateFormat="yyyy-MM-dd"
				minDate={new Date()}
				onChange={this.handleChange.bind(self)}
			/>

		</div>;
	}
}
