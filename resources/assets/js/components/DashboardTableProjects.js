import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DashboardMunicipalityForm from './DashboardMunicipalityForm';
import DashboardProjectsForm from './DashboardProjectsForm';
import Modal from 'react-responsive-modal';
import DashboardCitizenForm from './DashboardCitizenForm';
import {trans} from '../Helper';

export default class DashboardTableProjects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            openEdit: false,
            selectedProject: null,
            availableCitizens: [],
            projectStatusSettings: props.projectStatusSettings,
        };

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    }

    componentDidMount()
    {
        this.getManagerList();
        this.getAvailableCitizens();
    }

    onOpenModal(el) {
        this.setState({
            open: true
        });
    };

    onCloseModal(el) {
        this.setState({
            open: false
        });
    };

    onOpenEditModal(project, el) {
        this.setState({
            selectedProject: project,
            openEdit: true
        });
    };

    onCloseEditModal(el) {
        this.setState({
            openEdit: false
        });
    };

    getManagerList()
    {
        let self = this;

        $.ajax({
            url: '/api/user',
            beforeSend: function(xhr, type) {

                if (!type.crossDomain) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            }
        }).done(function(resp) {
            self.setState({
                managers: resp.users
            })
        });
    }

    getAvailableCitizens()
    {
        let self = this;

        $.ajax({
            url: '/api/available-citizens',
            beforeSend: function(xhr, type) {

                if (!type.crossDomain) {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            }
        }).done(function(resp) {
            self.setState({
                availableCitizens: resp.citizens
            });
        });
    }

    render() {

        var self = this,
            { open, openEdit } = self.state,
            rows,
            orderNo = 0,
            table;

        if (typeof self.props.projects !== 'undefined' && self.props.projects.length > 0) {
            rows = self.props.projects.map(function(project, id) {

                let statusClass = '';

                if (project.hours_left < 0)
                {
                    statusClass = 'alert alert-danger';
                }

                if (project.status_settings)
                {
                    orderNo = project.status_settings.order_no;
                }

                return (<tr key={id} onClick={self.onOpenEditModal.bind(self, project)} className={statusClass}>
                            <td>{project.id}</td>
                            <td>{project.citizens.name}</td>
                            <td>{project.kommune.name}</td>
                            <td>{project.project_manager.name}</td>
                            {/*<td>{_.find(project_activities, function (activity) { return activity.id === project.project_activity; }).name}</td>*/}
                            <td>{orderNo}</td>
                            <td>{project.project_status_settings_id}</td>
                            <td>{project.work_days_left}</td>
                        </tr>);
            }),
            table = (<table id="data-table">
                        <thead>
                            <tr>
                                <td>{trans('project', 'id')}</td>
                                <td>{trans('project', 'citizen')}</td>
                                <td>{trans('project', 'commune')}</td>
                                <td>{trans('project', 'manager')}</td>
                                <td>{trans('project', 'order_no')}</td>
                                <td>{trans('project', 'status_id')}</td>
                                <td>{trans('project', 'status_days_left')}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>);
        }

        return (
            <div className="table">
                <button className="small" onClick={self.onOpenModal.bind(self)}>Tilføj Projekt</button>
                <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                    <DashboardProjectsForm
                        refreshProjects={self.props.refreshProjects}
                        citizens={self.state.availableCitizens}
                        municipalities={self.props.municipalities}
                        managers={self.state.managers}
                        projectStatusSettings={self.state.projectStatusSettings}
                        // refreshProjectStatusSettings={self.getProjectSettings.bind(self)}
                        refreshAvailableCitizens={self.getAvailableCitizens.bind(self)}
                        closePopup={self.onCloseModal.bind(self)} />
                </Modal>
                <Modal open={openEdit} onClose={self.onCloseEditModal.bind(self)} showCloseIcon={false} center>
                    <span onClick={self.onCloseEditModal.bind(self)} className="close-icon"></span>
                    <DashboardProjectsForm
                        project={self.state.selectedProject}
                        closePopup={self.onCloseEditModal.bind(self)}
                        citizens={self.state.availableCitizens}
                        managers={self.state.managers}
                        municipalities={self.props.municipalities}
                        projectStatusSettings={self.state.projectStatusSettings}
                        // refreshProjectStatusSettings={self.getProjectSettings.bind(self)}
                        refreshAvailableCitizens={self.getAvailableCitizens.bind(self)}
                        refreshProjects={self.props.refreshProjects} />
                </Modal>
                {table}
            </div>
        );
    }
}
