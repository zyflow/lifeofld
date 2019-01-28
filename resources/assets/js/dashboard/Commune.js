import React, { Component } from 'react';
import Menu from '../components/Menu';
import Top from '../components/Top';
import Inventory from '../components/CommuneSetup/Inventory'

export default class Commune extends Component {
    constructor(props)
    {
        super(props);

        this.state = {
            communes: communes,
            selected_commune: selected_commune,
            selectedCommuneID: selected_commune.id,
            inventories: inventories,
        }
    }

    componentDidMount() {
    }

    getInventories(id)
    {
        var self = this;

        $.ajax({
            url: '/api/commune-setup',
            data: {'id': id},
            beforeSend: function(xhr, type) {

                if (!type.crossDomain)
                {
                    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                }
            }
        }).done(function(resp) {
            self.setState( {inventories: resp.inventories})
        });
    }

    handleChange(e)
    {
        let commune_id = this.state.selected_commune_id;

        if (e.target.value)
        {
            commune_id = e.target.value;
        }

        this.setState({
            selectedCommuneID: commune_id
        })

        this.getInventories(commune_id);
    }

    render() {

        let self = this,
            communes_sel = self.state.communes.map(function(status, i) {
                return (<option key={i} value={status.id}>{status.name}</option>)
            });

        return (
            <div className="dashboard-container">
                <Menu />
                <div className="right-content">
                    <Top citizens={citizens} />
                    <div className="main-container">

                        <div className="table">
                            <div className="title">Business parameters </div>

                            <label htmlFor="citizen_id">Choose kommune</label>
                            <select name="citizen_id" id="citizen_id"
                                    onChange={this.handleChange.bind(this)}
                                    defaultValue={this.state.selected_commune.id}
                                    onSelect={this.handleChange.bind(this)}>
                                {communes_sel}
                            </select>
                        </div>

                        <div className="table">
                            <Inventory
                                inventories={self.state.inventories}
                                selectedCommuneID={self.state.selectedCommuneID}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
