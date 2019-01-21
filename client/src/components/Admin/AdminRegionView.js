//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminCaseList from "./AdminCaseList";
import CaseService from "../../services/CaseService";
import RegionService from "../../services/RegionService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

class AdminRegionView extends Component {
    cases = [];
    render() {
        if(!this.props.region) return null;
        this.fetchCases();
        return(
            <div style={{'maxHeight': '700px'}}>
                <div className={'card'}>
                    <div className={'card-body'}>
                        <div className={'card-title'}>
                            <strong>ID: </strong>
                            {this.props.region.region_id}
                            <strong className={'ml-3'}>Kommune: </strong>
                            {this.props.region.name}
                            <button onClick={(event) => this.editRegion(this.props.region)} className={'btn btn-primary float-right mr-3'}>
                                <FontAwesomeIcon icon={faEdit}/>
                            </button>
                            <button onClick={(event) => this.deleteRegion(this.props.region)} className={'btn btn-danger float-right ml-3'}>
                                <FontAwesomeIcon icon={faTrashAlt}/>
                            </button>
                        </div>
                        <div className={'card-text'}>
                            <strong>Fylke: </strong>
                            {this.props.region.county_name}
                            <div className={'text-muted mt-1'}>
                                <strong>Lokasjon:</strong>
                                <div className={'ml-3'}>
                                    Breddegrad: {this.props.region.lat.toString().substring(0, 8)}
                                    <br/>
                                    Lengdegrad: {this.props.region.lon.toString().substring(0, 8)}
                                </div>
                            </div>
                            <div>
                                Antall saker: {this.cases.length}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <AdminCaseList cases={this.cases} onCaseSelected={(c) => console.log('case selected')}/>
                </div>
            </div>
        );
    }

    fetchCases(){
        if(this.props.region){
            let caseService = new CaseService();
            caseService.getCaseGivenRegionId(this.props.region.region_id)
                .then((cases: Case[]) => {
                    this.cases = cases;
                })
                .catch((error: Error) => console.error(error));
        } else {
            console.log('No Region??');
        }
    }

    deleteRegion(region) {
        let regionService = new RegionService();
        regionService.deleteRegion(region.region_id)
            .then(result => {
                console.log(result);
            })
            .catch((error: Error) => console.error(error));
    }

    editRegion(region) {
        let regionService = new RegionService();
    }
}
export default AdminRegionView;