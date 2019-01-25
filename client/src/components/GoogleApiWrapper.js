import * as React from 'react';
import { Component } from 'react-simplified';
import { GoogleApiWrapper, google, InfoWindow, Map, Marker } from 'google-maps-react';
import { timingSafeEqual } from 'crypto';
import SearchBox from './SearchBox'

export class GoogleMapsContainer extends Component {


  /**
   * handles click on map
  */
  onClick(t, map, coord) {
    const latLng = { lat: coord.latLng.lat(), lon: coord.latLng.lng() };
    this.props.updatePos(latLng);
  }

  /**
    * handles what which actions to do when component is updated
    */
  componentDidUpdate(prevProps) {
    try {
      this.gmap.panTo(this.props.markerPos);
    } catch{
      console.log("catch");

    }
    if (!this.props.isClickable) {
      this.gmap.onClick = null;
      this.gmap.draggable = false
      this.gmap.setOptions({ styles: [{ stylers: [{ saturation: -100 }] }] })
    } else {
      this.gmap.draggable = true
      this.gmap.onClick = (t, map, coord) => this.onClick(t, map, coord)
      this.gmap.setOptions({ styles: [{ stylers: [{ saturation: 0 }] }] })
    }
    if (this.props.chosenMuni !== undefined && this.props.chosenMuni !== prevProps.chosenMuni) {

      let pos = { lat: this.props.chosenMuni.lat, lon: this.props.chosenMuni.lon }
      this.props.updatePos(pos)
    }
  }

  /**
  * gets result form google-maps search box
  */
  getSearchPlaces(res) {
    let lok = res[0].geometry.location
    let respos = { lat: lok.lat(), lon: lok.lng() }
    this.props.updatePos(respos)
  }

  /**
     * Generates HTML code.
     * return {*} HTML Element with sub-elements.
     */
  render() {
    return (
      <div reg="a">
        <SearchBox ref="search" map={this.gmap} hide={!this.props.isClickable} callback={this.getSearchPlaces}></SearchBox>
        <Map
          ref="Gmap"
          styles={[{ stylers: [{ saturation: -100 }] }]}
          item
          xs={12}
          google={this.props.google}
          onClick={this.props.isClickable ? (t, map, coord) => this.onClick(t, map, coord) : null}
          zoom={14}
          initialCenter={this.props.markerPos}
          streetViewControl={false}
          draggable={this.props.isClickable}
        >
          < Marker ref="marker" position={this.props.markerPos} />
        </Map >
      </div>
    );
  }

  /**
* When component mounts: Initiate fetching logic and sets component variable states.
*/
  mounted() {
    this.gmap = this.refs.Gmap.map;
    this.marker = this.refs.marker.marker;

  }
}

/**
* sets the api key
*/
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDhfEwBKYpfnkGiGMNV44wkKBtxI_oH_lo'
})(GoogleMapsContainer);
