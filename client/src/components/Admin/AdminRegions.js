//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import AdminRegionsList from "./AdminRegionsList";
import AdminRegionView from "./AdminRegionView";

class AdminRegions extends Component {
    viewing_region = null;
    render() {
        return(
            <div>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-lg'}>
                            <h2>Registrerte kommuner</h2>
                            <AdminRegionsList onRegionSelected={(region) => this.onRegionSelected(region)}/>
                        </div>
                        <div className={'col-lg'}>
                            <h2>Diverse</h2>
                            <AdminRegionView region={this.viewing_region}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onRegionSelected(region: Region) {
        console.log('Region selected:', region);
        this.viewing_region = region;
    }
}
export default AdminRegions;