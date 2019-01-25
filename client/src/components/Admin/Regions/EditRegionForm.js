//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import CountyService from "../../../services/CountyService";
import RegionService from "../../../services/RegionService";
import ToolService from "../../../services/ToolService";

class EditRegionForm extends Component{
    newregion = {
        name: ""
    };

    counties = [];
    county = null;
    error = null;

    render() {
        return(
            <div key={this.props.region.region_id}>
                {this.error}
                <form ref={'editRegionForm'} className={'form-group'}>
                    <label htmlFor={'edit-region-form-name'}>Kommunenavn:</label>
                    <input id={'edit-region-form-name'}
                           className={'form-control'}
                           type={'text'}
                           name={'edit-region-form-name'}
                           defaultValue={this.props.region.name}
                           required
                    />

                    <label htmlFor={'edit-region-form-lat'}>Breddegrad</label>
                    <input
                        className={'form-control my-2'}
                        type={'number'}
                        id={'edit-region-form-lat'}
                        name={'edit-region-form-lat'}
                        placeholder="Breddegrad"
                        defaultValue={this.props.region.lat}
                        required
                    />

                    <label htmlFor={'edit-region-form-lon'}>Lengdegrad</label>
                    <input
                        className={'form-control my-2'}
                        type={'number'}
                        id={'edit-region-form-lon'}
                        name={'edit-region-form-lon'}
                        placeholder="Lengdegrad"
                        defaultValue={this.props.region.lon}
                        required
                    />

                    <label htmlFor={'edit-region-form-county-selector'}>Fylke</label>
                    <select
                        onChange={(event) => this.county_selected(event)}
                        defaultValue={this.props.region.county_id}
                        className={'form-control'}
                        id={'edit-region-form-county-selector'}
                        required
                    >
                        {this.counties.map(e => (
                            <option key={e.county_id} value={e.county_id}>
                                {' '}
                                {e.name}
                                {' '}
                            </option>
                        ))}
                    </select>
                </form>
                <button onClick={(event) => console.log('Avbryter')}
                        type="button"
                        className="btn btn-danger float-right"
                        data-dismiss="modal">Avbryt</button>
                <button onClick={(event) => this.submit(event)}
                        type="button"
                        className="btn btn-primary"
                >Oppdater</button>
            </div>
        );
    }

    componentWillReceiveProps(newProps) {
        if(newProps.region !== this.props.region) {
            for(let c in this.counties) {
                if(c.county_id === newProps.region.county_id) {
                    this.county = c;
                    break;
                }
            }
            this.setState({
                newregion: newProps.region
            });
        }
    }

    mounted () {
        let countyService = new CountyService();
        countyService.getAllCounties()
            .then((counties: County[]) => {
                this.counties = counties;
            })
            .catch((error: Error) => console.error(error));
    }

    submit(event) {
        event.preventDefault();
        let form = this.refs.editRegionForm;
        if(form.checkValidity()) {
            $('#spinner').show();
            let county_selector = document.querySelector('#edit-region-form-county-selector');

            let newRegion = {
                region_id: this.props.region.region_id,
                county_id: Number(county_selector[county_selector.selectedIndex].value),
                name: document.querySelector('#edit-region-form-name').value,
                lat: Number(document.querySelector('#edit-region-form-lat').value),
                lon: Number(document.querySelector('#edit-region-form-lon').value)
            };
            let regionService = new RegionService();
            regionService.updateRegion(newRegion, newRegion.region_id)
                .then(res => {
                    console.log(res);
                    $('#spinner').hide();
                    this.props.editRegion(newRegion);
                })
                .catch((error: Error) => {
                    $('#spinner').hide();
                    this.error = ToolService.getUserUpdateErrorAlert(error);
                    console.error(error);
                });
        } else {
            form.reportValidity();
        }
    }

    county_selected(event) {

    }
}
export default EditRegionForm;