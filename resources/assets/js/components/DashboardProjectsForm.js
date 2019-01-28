import React, {Component} from 'react';
import {customSelections, FileList} from '../Helper';
import Modal from 'react-responsive-modal';
import Dropzone from 'react-dropzone';
import DashboardProjectFormStatus from './DashboardProjectFormStatus';


export default class DashboardProjectsForm extends Component {
	constructor(props)
	{
		super(props);

		this.state = {
			errors: [],
			open: false,
			files: [],
			citizenList: this.props.citizens,
			uploadedFiles: [],
			startDate: []
			// name: this.props.municipality ? this.props.municipality.name : null,
			// surname: this.props.municipality ? this.props.municipality.surname : null,
		};

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});

	}

	componentDidMount()
	{
		customSelections();

		if (this.props.project && this.props.project.citizens && this.props.project.citizens.files)
		{
			this.setState({
				uploadedFiles: this.props.project.citizens.files
			});
		}
	}

	addProject(el)
	{
		var self = this;

		$.ajax({
			url: '/project',
			method: "POST",
			data: $(".project-form").serialize(),
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
			self.props.refreshProjects();
			self.props.refreshAvailableCitizens();
			self.props.closePopup();
		});
	}

	onDrop(files)
	{
		let fileList = [];

		files.forEach(function(value) {
			fileList.push({name: value.name});
		});

		this.setState({files});
	}

	onCancel()
	{
		this.setState({
			files: []
		});
	}

	updateProject(id, el)
	{
		var self = this;

		let fd = new FormData($(".project-form")[0]);
		fd.append("_method", 'put');

		for (var x = 0; x < this.state.files.length; x++)
		{
			fd.append("files[]", this.state.files[x]);
		}

		$.ajax({
			url: '/project/' + id,
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
			self.props.refreshProjects();
			self.props.refreshAvailableCitizens();
			self.props.closePopup();
		});
	}

	removeProject(id, el)
	{
		var self = this;

		el.preventDefault();

		$.ajax({
			url: '/project/' + id,
			method: "DELETE",
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
						errors: self.state.errors.concat([item])
					});
				});

				$(".error-msg").fadeIn();

				self.setState({
					open: false
				});
			}
		}).done(function(resp) {
			self.setState({
				open: false
			});

			self.props.refreshProjects();
			self.props.refreshAvailableCitizens();
			self.props.closePopup();
		});
	}

	onOpenModal(el)
	{
		el.preventDefault();

		this.setState({
			open: true
		});
	};

	onCloseModal(el)
	{
		this.setState({
			open: false
		});
	};

	changeInput(name, el)
	{
		var self = this;

		if (name === "name")
		{
			self.setState({
				name: $(el.currentTarget).val()
			});
		}
		else
		{
			self.setState({
				surname: $(el.currentTarget).val()
			});
		}
	}

	getAvailableCitizenList()
	{
		let availableCitizenList = [];
		if (this.props.citizens)
		{
			availableCitizenList = this.props.citizens.map(function(value, key) {
				return {id: value.id, name: value.name};
			});
		}

		if (typeof this.props.project !== 'undefined' && typeof this.props.project.citizens !== 'undefined')
		{
			// check if is not already added to object array, else don't duplicate
			if (availableCitizenList.filter(availableCitizenList => (availableCitizenList.id === this.props.project.citizens.id)).length === 0)
			{
				availableCitizenList.push({
					id: this.props.project.citizens.id, 'name': this.props.project.citizens.name
				});
			}
		}

		return availableCitizenList;
	}

	render()
	{
		const files = this.state.files.map(file => (
			<li key={file.name}>
				{file.name}
			</li>
		));

		const baseStyle = {
			height: 120,
			borderWidth: 2,
			borderColor: '#666',
			borderStyle: 'dashed',
			borderRadius: 5
		};
		const activeStyle = {
			borderStyle: 'solid',
			borderColor: '#6c6',
			backgroundColor: '#eee'
		};
		const rejectStyle = {
			borderStyle: 'solid',
			borderColor: '#c66',
			backgroundColor: '#eee'
		};

		let availableCitizenList = this.getAvailableCitizenList();

		var self                    = this,
		    citizensSel             = availableCitizenList.map(function(status, i) {
			    return (
				    <option key={status.id} value={status.id}>
					    {status.name}
				    </option>
			    );
		    }),

		    kommuneSel              = self.props.municipalities.map(function(status, i) {
			    return (<option key={status.id} value={status.id}>{status.name}</option>);
		    }),
		    {open}                  = self.state,
		    errors                  = self.state.errors.map(function(error, i) {
			    return (<div key={i}>{error}</div>);
		    }),
		    all_managers            = self.props.managers.map(function(manager, i) {
			    return (<option key={i}
			                    value={manager.id}>{manager.name}</option>);
		    }),
		    manager_id,
		    status_id,
		    manual_status           = true,
		    project,
		    project_status_settings = self.props.projectStatusSettings,
		    citizen_id
		;

		if (self.props.project)
		{
			manager_id = self.props.project.manager_id;
			status_id = self.props.project.project_status;
			manual_status = self.props.project.manual_status;
			project = self.props.project;
			citizen_id = self.props.project.citizen_id;
		}

		let the_date = new Date();

		return (
			<div className="form-content">
				<div className="success-msg">
					<span>Municipality {self.props.project ? "updated" : "added"}!</span>
					<span><img src="/img/success.svg"/></span>
				</div>

				<div className="error-msg">
					<div className="errors">
						<img src="/img/warning.svg"/>
						<span>{errors}</span>
					</div>
				</div>

				<div className="steps">
					<div className="step active">
						<span className="step-title">Project </span>
					</div>
				</div>

				<form id="form" className="project-form">
					<div className="left">
						<div className="field">
							<label htmlFor="citizen_id">Citizen</label>
							<select name="citizen_id" id="citizen_id" defaultValue={citizen_id}>
								{citizensSel}
							</select>
						</div>

						{/*<SelectInput value='as' id='as' label='as' />*/}

						<div className="field">
							<label htmlFor="name">Kommune</label>
							{/*<select name="" id=""></select>*/}
							<select name="kommune_id" id="kommune_id">
								{kommuneSel}
							</select>
							{/*<input type="text" name="name" id="name" defaultValue={self.state.name} onChange={self.changeInput.bind(self, "name")}/>*/}
						</div>

					</div>
					<div className="right">
						<div>

							<div className="field">
								<label htmlFor="manager_id">Manager</label>
								<select name="manager_id"
								        id="manager_id"
								        defaultValue={manager_id}>
									{all_managers}
								</select>
							</div>

							{/*<DashboardProjectFormStatus*/}
								{/*closePopup={self.onCloseModal.bind(self)}*/}
								{/*refreshInventories={self.props.refreshInventories}*/}
							{/*/>*/}

							<DashboardProjectFormStatus
								displayDate={the_date}
								onChange={self.handleChange}
								// statuses={statuses}
								status_id={status_id}
								project_status_settings={project_status_settings}
								project={project}
							/>

						</div>

					</div>
					<div className="col-md-12 upload-container">
						<label htmlFor="kommune">Files</label>
						<Dropzone
							onDrop={this.onDrop.bind(this)}
							onFileDialogCancel={this.onCancel.bind(this)}>
							{({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles}) => {
								let styles = {...baseStyle};
								styles = isDragActive ? {...styles, ...activeStyle} : styles;
								styles = isDragReject ? {...styles, ...rejectStyle} : styles;

								return (
									<div {...getRootProps()} className="upload">
										<input id="files" {...getInputProps()} />
										{files.length === 0 &&
										<div className="not-selected">Click to Upload <img src="/img/upload.svg"/> Drag Files here</div>
										}

										{isDragReject &&
										<div>Unsupported file type...</div>
										}

										{files.length > 0 ?
											<ul>{files}</ul>
											: null}
									</div>
								);
							}}
						</Dropzone>
					</div>

					<div className="col-md-12">
						<FileList files={self.state.uploadedFiles}/>
					</div>
				</form>

				<div className="actions edit">
					<div className="left block">
						{self.props.project ?
							<span>
                            <span className="remove" onClick={self.onOpenModal.bind(self)}>Remove</span>
                            <Modal open={open} onClose={self.onCloseModal.bind(self)} showCloseIcon={false} center>
                                <span onClick={self.onCloseModal.bind(self)} className="close-icon"></span>
                                <div className="remove-container">
                                    {"Do you want to remove " + self.props.project.name}
	                                <div className="buttons">
                                        <button onClick={self.removeProject.bind(self, self.props.project.id)}>Yes</button>
                                        <button onClick={self.onCloseModal.bind(self)} className="no">No</button>
                                    </div>
                                </div>
                            </Modal>
                        </span>
							: null}
					</div>
					<div className="center block"></div>
					<div className="right block">
						<span onClick={self.props.project ? self.updateProject.bind(self, self.props.project.id) : self.addProject.bind(self)}>Save</span>
					</div>
				</div>
			</div>
		);
	}
}
