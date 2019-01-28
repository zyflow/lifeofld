import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Menu from '../components/Menu';
import Top from '../components/Top';

export default class Export extends Component {
    render() {
        return (
            <div className="dashboard-container">
                <Menu />
                <div className="right-content">
                    <Top citizens={citizens} />
                    <div className="main-container">
                        <div className="mobile-title">{ document.title.split(" | ")[0] }</div>
                        <b>Export til eConomic</b> will be here
                    </div>
                </div>
            </div>
        );
    }
}