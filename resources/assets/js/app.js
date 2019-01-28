require('./bootstrap');
require('jquery');
require('datatables');

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import Dashboard from './dashboard/Dashboard';
import Users from './dashboard/Users';
import Commune from './dashboard/Commune';
import Budget from './dashboard/Budget';
import Export from './dashboard/Export';
import Settings from './dashboard/Settings';
import {customSelections} from './Helper';



render(
	<Router history={browserHistory}>
		<Route path="/home" component={Dashboard}/>
		<Route path="/login"/>
		<Route path="/register"/>
		<Route path="/user-admin" component={Users}/>
		<Route path="/commune-setup" component={Commune}/>
		<Route path="/budget-import" component={Budget}/>
		<Route path="/export-til-economic" component={Export}/>
		<Route path="/settings" component={Settings}/>
	</Router>,
	document.getElementById('root'));
customSelections();

