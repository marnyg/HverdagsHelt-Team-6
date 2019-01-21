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
                <div className={'container mx-3'}>
                    <div className={'row'}>
                        <div className={'col-lg'}>
                            <AdminRegionsList onRegionSelected={(region) => this.onRegionSelected(region)}/>
                        </div>
                        <div className={'col-lg'}>
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