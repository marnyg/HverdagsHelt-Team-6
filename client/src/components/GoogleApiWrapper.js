import * as React from 'react';
import { Component } from 'react-simplified';
import { GoogleApiWrapper, google, InfoWindow, Map, Marker } from 'google-maps-react';
import { timingSafeEqual } from 'crypto';
import SearchBox from './SearchBox'

export class GoogleMapsContainer extends Component {

  onClick(t, map, coord) {
    const latLng = { lat: coord.latLng.lat(), lon: coord.latLng.lng() };
    this.props.updatePos(latLng);
  }

  componentDidUpdate(prevProps) {
    try {
      if (!this.props.isClickable) {
      }catch{
        console.log("kjladkjladkadsjkladkjladl");

      }
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

  getSearchPlaces(res) {
    let lok = res[0].geometry.location
    let respos = { lat: lok.lat(), lon: lok.lng() }
    this.props.updatePos(respos)
  }
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
  mounted() {
    this.gmap = this.refs.Gmap.map;
    this.marker = this.refs.marker.marker;

  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDhfEwBKYpfnkGiGMNV44wkKBtxI_oH_lo'
})(GoogleMapsContainer);
