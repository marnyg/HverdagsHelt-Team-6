//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import RegionForm from './RegionForm';
import CountyForm from "./CountyForm";
import CountyService from "../../services/CountyService";

class RegionRegistration extends Component {
    counties = [];

    render() {
        return(
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-lg'}>
                        <RegionForm counties={this.counties}/>
                    </div>
                    <div className={'col-lg'}>
                        <CountyForm onCountyCreated={() => this.onCountyCreated()}/>
                    </div>
                </div>
            </div>
        );
    }

    onCountyCreated() {
        let countyService = new CountyService();
        countyService.getAllCounties()
            .then((counties: County[]) => {
                this.counties = counties;
            })
            .catch((error: Error) => console.error(error));
    }

    mounted() {
        let countyService = new CountyService();
        countyService.getAllCounties()
            .then((counties: County[]) => {
                this.counties = counties;
            })
            .catch((error: Error) => console.error(error));
    }
}
export default RegionRegistration;