import React, { Component } from 'react';
import Menu from '../components/Menu';
import Top from '../components/Top';
import SettingsTableStatuses from '../components/SettingsTableStatuses';
import {dataTables} from '../Helper';

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: settings,
            translations: translations
        };
    }

    updateSettings(el) {
        var self = this;statuses

        el.preventDefault();
    }

    componentDidMount() {
        dataTables();
        this.getSettingStatuses();
    }

    getSettingStatuses()
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
                statuses: resp.projectStatusSettings
            })
        });
    }

    render() {
        var self = this;

        return (
            <div className="dashboard-container settings">
                <Menu />
                <div className="right-content">
                    <Top citizens={citizens} />
                    <div className="main-container">
                        <div className="mobile-title">{ document.title.split(" | ")[0] }</div>
                        <SettingsTableStatuses
                               refreshSettingStatus={self.getSettingStatuses.bind(self)}
                               statuses={self.state.statuses}
                        />
                        {/*<form id="form" onSubmit={self.updateSettings.bind(self)}>
                            {all_settings}
                            <div className="buttons">
                                <button type="submit">Gem</button>
                            </div>
                        </form>*/}
                    </div>
                </div>
            </div>
        );
    }
}
