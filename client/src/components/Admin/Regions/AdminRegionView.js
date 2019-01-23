//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminCaseList from "./AdminCaseList";
import CaseService from "../../../services/CaseService";
import RegionService from "../../../services/RegionService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import VerificationModal from "../../VerificationModal";
import EditRegionForm from "./EditRegionForm";

class AdminRegionView extends Component {
    cases = [];
    render() {
        if(!this.props.region) {
            return(
                <div style={{'maxHeight': '700px'}}>
                    <div className={'card'}>
                        <div className={'card-body'}>
                            <div className={'card-title'}>
                                <strong>ID: </strong>
                                <strong className={'ml-3'}>Kommune: </strong>
                            </div>
                            <div className={'card-text'}>
                                <strong>Fylke: </strong>
                                <div className={'text-muted mt-1'}>
                                    <strong>Lokasjon:</strong>
                                    <div className={'ml-3'}>
                                        Breddegrad:
                                        <br/>
                                        Lengdegrad:
                                    </div>
                                </div>
                                <div>
                                    Antall saker:
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
                            <button
                                onClick={(event) => this.setDeleteRegionModalContent(this.props.region)}
                                className={'btn btn-danger float-right ml-2'}
                                type="button" data-toggle="modal"
                                data-target="#verify-modal">
                                <FontAwesomeIcon icon={faTrashAlt}/>
                            </button>
                            <button
                                onClick={(event) => this.setEditRegionModalContent(this.props.region)}
                                className={'btn btn-primary float-right'}
                                type="button" data-toggle="modal"
                                data-target="#verify-modal">
                                <FontAwesomeIcon icon={faEdit}/>
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

    setDeleteRegionModalContent(region) {
        let modal_header = 'Er du sikker?';
        let modal_body = (
            <div>
                <div className={'my-3 mx-3'}>
                    Er du sikker på at du vil slette <strong>{region.name}</strong> fra de registrerte kommunene?
                    <br/>
                    Dette vil også slette alle sakene registrert i kommunen.
                </div>
                <button onClick={(event) => console.log('Avbryter')} type="button" className="btn btn-primary" data-dismiss="modal">Avbryt</button>
                <button onClick={(event) => this.deleteRegion(event, region)} type="button" className="btn btn-danger float-right" data-dismiss="modal">Slett kommune</button>
            </div>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    setEditRegionModalContent(region) {
        let modal_header = 'Er du sikker?';
        let modal_body = (
            <EditRegionForm region={region} editRegion={(newregion) => {
                this.editRegion(newregion);
            }}/>
        );
        let modal_footer = null;
        VerificationModal.setcontent(modal_header, modal_body, modal_footer);
    }

    editRegion(region) {
        console.log('submittin new region:', region);
        let regionService = new RegionService();
        regionService.updateRegion(region, region.region_id)
            .then(res => {
                console.log(res);
                $('#verify-modal').modal('hide');
                this.props.onRegionUpdate(region);
            })
            .catch((error: Error) => console.error(error));
    }

    deleteRegion(event, region) {
        let regionService = new RegionService();
        regionService.deleteRegion(region.region_id)
            .then(res => {
                console.log(res);
                $('#verify-modal').modal('hide');
                this.props.onRegionDelete(region);
            })
            .catch((error: Error) => console.error(error));
    }
}
export default AdminRegionView;