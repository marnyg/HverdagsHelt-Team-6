//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import ToolService from "../../../services/ToolService";
import RegionService from "../../../services/RegionService";
import CountyService from "../../../services/CountyService";

/**
 * Creates a list of regions for the admin user to view and edit.
 */
class AdminRegionsList extends Component {
    regions = [];
  
  /**
   * Generates HTML code
   * @returns {*} HTML Element with sub-elements
   */
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
                        {this.props.regions.map(region => {
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
}
export default AdminRegionsList;