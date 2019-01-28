import React, {Component} from 'react';
import {trans} from '../Helper';

export default class Notification extends Component {

	constructor(props)
	{
		super(props);
		this.state = {
			date_notifications: [],
			notifications: [],
			notification_full_count: 0
		};

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	componentDidMount()
	{
		var self = this;

		this.getNotifications();
	}

	getNotifications()
	{
		var self = this;
		$.ajax({
			url: '/api/notification',
			method: "GET",
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {

			self.setState({
				notifications: resp.notifications,
				notification_full_count: resp.notification_full_count
			});
		});
	}

	updateNotifications(id)
	{
		let self = this;
		let fd = new FormData;
		fd.append('id', id)
		fd.append("_method", 'put');

		$.ajax({
			url: '/api/notification/' + id,
			method: "PUT",
			data: fd,
			processData: false,
			contentType: false,
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {

			self.getNotifications();
			// self.setState({
			// 	notifications: resp.notifications
			// });
		});
	}

	toggleNotifications(el)
	{
		this.getNotifications();
		$(".notifications-dropdown").fadeToggle();
	}

	readNotification(el)
	{
		var self = this;

		$(el.currentTarget).toggleClass("visible");
	}

	render()
	{
		var self         = this,
		    unread_count = 0,
			notifications
		    ;

		if (self.state.notifications.length > 0)
		{
			unread_count = self.state.notification_full_count;
			notifications = self.state.notifications.map(function(value, key) {
				return (<p key={key}>{value.message}<button className="btn btn-success btn-sm " data-id={value.id} key={key} onClick={self.updateNotifications.bind(self, value.id)}> {trans('navigation', 'clear')}</button></p>);
			})
		}

		return (
			<div className="user">
				<div onClick={self.toggleNotifications.bind(self)} className={unread_count > 0 ? "notifications active" : "notifications"}>
					<img src="/img/notifications.svg"/>
				</div>
				<div className="notifications-dropdown hidden">
					{unread_count >= 0 ? <div className="unread">You have {unread_count} unread notifications!</div> : null}
					<div className="row">
						<div className="col-sm-12">
							{notifications}
						</div>
					</div>
					{self.state.date_notifications.length > 0 ? <div className="archive">All Notifications</div> : null}
				</div>
			</div>
		);
	}
}
