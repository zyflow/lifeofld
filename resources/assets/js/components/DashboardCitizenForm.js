import React, {Component} from 'react';
import {customSelections, FileList, getMunicipalities, TextInput} from '../Helper';
import Modal from 'react-responsive-modal';
import Dropzone from 'react-dropzone';
import {trans} from '../Helper';

export default class DashboardCitizenForm extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			errors: [],
			open: false,
			activeStep: 1,
			files: [],
			uploadedFiles: [],
			project_status: '',
			citizenAddress: [],
			maps: '',
		};

		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	componentDidMount()
	{
		if (this.props.citizen)
		{
			this.setState({
				project_status: this.props.citizen.project_status,
				uploadedFiles: this.props.citizen.files,
				citizenAddress: this.props.citizen.address,
				maps: "https://maps.google.com/maps?q=" + this.props.citizen.address + "&t=&z=13&ie=UTF8&iwloc=&output=embed"
			});
		}

		customSelections();
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

	addCitizen(el)
	{
		var self = this;
		var ins = document.getElementById('files').files.length;

		let fd = new FormData($(".form-step1")[0]);
		// fd.append("_method", 'put');

		for (var x = 0; x < this.state.files.length; x++)
		{
			fd.append("files[]", this.state.files[x]);
		}

		$.ajax({
			url: '/api/citizen',
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
			self.props.refreshCitizens();
			self.props.closePopup();
		});
	}

	updateCitizen(el)
	{
		var self = this;
		var ins = document.getElementById('files').files.length;

		let fd = new FormData($(".form-step1")[0]);
		fd.append("_method", 'put');

		for (var x = 0; x < this.state.files.length; x++)
		{
			fd.append("files[]", this.state.files[x]);
		}

		$.ajax({
			url: '/api/citizen/' + self.props.citizen.id,
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
			self.props.refreshCitizens();
			self.props.closePopup();
		});
	}

	removeCitizen(id, el)
	{
		var self = this;

		el.preventDefault();

		$.ajax({
			url: '/api/citizen/' + id,
			method: "DELETE",
			beforeSend: function(xhr, type) {

				if (!type.crossDomain)
				{
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}
		}).done(function(resp) {
			self.setState({
				open: false
			});

			self.props.closePopup();

			$("#data-table").find("#" + id).parent().remove();
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

	onChange(el)
	{
		if (el.target.value !== '')
		{
			this.setState({
				maps: "https://maps.google.com/maps?q=" + el.target.value + "&t=&z=13&ie=UTF8&iwloc=&output=embed"
			});
			setTimeout(() => {}, 2000);
		}
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

		var self   = this,
		    {open} = self.state,
		    errors = self.state.errors.map(function(error, i) {
			    return (<div key={i}>{error}</div>);
		    }),
		    email,
		    name,
		    surname,
		    address,
		    cpr,
		    mobile,
		    city,
		    maps,
		    post_code,
		    address2;

		if (self.props.citizen)
		{
			email = self.props.citizen.email;
			name = self.props.citizen.name;
			surname = self.props.citizen.surname;
			address = self.props.citizen.address;
			address2 = self.props.citizen.address2;
			cpr = self.props.citizen.cpr;
			city = self.props.citizen.city;
			mobile = self.props.citizen.mobile;
			post_code = self.props.citizen.post_code;

		}

		return (
			<div className="form-content">
				<div className="success-msg project">
					<span>Project {self.props.citizen ? "updated" : "added"}</span>
					<span><img src="/img/success.svg"/></span>
				</div>

				<div className="success-msg citizen">
					<span>Citizen {self.props.citizen ? "updated" : "added"}</span>
					<span><img src="/img/success.svg"/></span>
				</div>

				<div className="success-msg kommune">
					<span>Municipality added</span>
					<span><img src="/img/success.svg"/></span>
				</div>

				<div className="error-msg">
					<div className="errors">
						<img src="/img/warning.svg"/>
						<span>{errors}</span>
					</div>
				</div>

				<div className="steps">
					<div className={"step " + (self.state.activeStep === 1 ? "active" : null)}>
						<span className="step-title">Borger {self.state.project_status ? "- " + self.state.project_status : null}</span>
					</div>
				</div>

				<form action="" method="POST" className='form-step1'>
					<div className={"step-content step-content-1 " + (self.state.activeStep === 1 ? "active " : null)}>
						<div className="left">
							<TextInput id="name" value={name} label={trans('citizens', 'name')}/>
							<TextInput id="surname" value={surname} label={trans('citizens', 'surname')}/>
							<TextInput id="email" value={email} label={trans('citizens', 'email')}/>
							<div className="field">
								<label htmlFor="address">Address</label>
								<input type="text" name="address" id="address" defaultValue={address} onInput={this.onChange.bind(this)}/>
							</div>

							{/*<TextInput id="address" value={address} label="Address"  />*/}
							<TextInput id="post_code" value={post_code} label="Post code"/>

							{/*<SelectInput id="manager_id" value={managers} label="Manager" savedValue={manager_id}/>*/}

						</div>
						<div className="right">
							<TextInput id="mobile" value={mobile} label={trans('citizens', 'mobile')}/>
							<TextInput id="cpr" value={cpr} label={trans('citizens', 'cpr')}/>
							<TextInput id="address2" value={address2} label="Address2"/>
							<TextInput id="city" value={city} label="City"/>
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
							<FileList files={this.state.uploadedFiles}/>
						</div>

						{/*<input type="file" id="files[]" value={self.state.files}/>*/}
						{self.props.citizen ?
							<div className="maps">
								<iframe id="gmap_canvas" src={this.state.maps}></iframe>
							</div>
							: null}
						{!self.props.citizen ?
							<div className="info">Please fill up all information about citizen and go next step to choose municipality!</div> : null}
					</div>
				</form>

				<div className={"actions " + (self.props.citizen ? "edit" : null)}>
					<div className="left block">
						{self.props.citizen ?
							<div>
								<span className="remove"
								      onClick={self.onOpenModal.bind(self)}>Remove</span>
								<Modal open={open}
								       onClose={self.onCloseModal.bind(self)}
								       showCloseIcon={false}
								       center>
									<span onClick={self.onCloseModal.bind(self)}
									      className="close-icon"></span>
									<div className="remove-container">
										{"Do you want to remove " + self.props.citizen.name + " " + self.props.citizen.surname + " ?"}
										<div className="buttons">
											<button onClick={self.removeCitizen.bind(self, self.props.citizen.id)}>Yes</button>
											<button onClick={self.onCloseModal.bind(self)}
											        className="no">No
											</button>
										</div>
									</div>
								</Modal>
							</div>
							: null}
					</div>
					<div className="right block">
						<span onClick={self.props.citizen ? self.updateCitizen.bind(self, self.props.citizen.id) : self.addCitizen.bind(self)}>Save</span>
					</div>
				</div>

			</div>
		);
	}
}
