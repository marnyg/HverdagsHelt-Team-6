//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import ToolService from "../../services/ToolService";
import RegionService from "../../services/RegionService";
import CountyService from "../../services/CountyService";

class AdminRegionsList extends Component {
    regions = [];
    render() {
        return(
            <div className={'card mb-3'} style={{'overflow':'scroll','maxHeight': '700px'}}>
                <table className="table table-hover table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Kommune ID</th>
                        <th scope="col">Navn</th>
                        <th scope="col">Fylke</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.regions.map(region => {
                            return(
                                <tr key={region.region_id} style={{ cursor: 'pointer' }}>
                                    <td onClick={(event) => this.props.onRegionSelected(region)}>{region.region_id}</td>
                                    <td onClick={(event) => this.props.onRegionSelected(region)}>{region.name}</td>
                                    <td onClick={(event) => this.props.onRegionSelected(region)}>{region.county_name}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    mounted() {
        let regionService = new RegionService();
        regionService.getAllRegions()
            .then((regions: Region[]) => {
                regions.map(reg => reg.county_name = '');
                this.regions = regions;
            })
            .then(() => {
                let countyService = new CountyService();
                countyService.getAllCounties()
                    .then((counties: County[]) => {
                        for (let i = 0; i < counties.length; i++) {
                            for (let j = 0; j < this.regions.length; j++) {
                                if(this.regions[j].county_id === counties[i].county_id){
                                    this.regions[j].county_name = counties[i].name;
                                }
                            }
                        }
                    })
                    .catch((error: Error) => console.error(error));
            })
            .catch((error: Error) => console.error(error));
    }
}
export default AdminRegionsList;