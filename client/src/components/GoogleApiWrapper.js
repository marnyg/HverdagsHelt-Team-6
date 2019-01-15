import * as React from 'react';
import { Component } from 'react-simplified';
import { GoogleApiWrapper, InfoWindow, Map, Marker, SearchBox } from 'google-maps-react';

export class GoogleMapsContainer extends Component {
  onClick(t, map, coord) {
    const latLng = { lat: coord.latLng.lat(), lon: coord.latLng.lng() };
    this.props.updatePos(latLng);
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);

    if (prevProps.params.centerPos !== this.props.params.centerPos) {
      this.gmap.setCenter(this.props.centerPos);
      this.marker.setPosition(this.props.centerPos)
    }
  }

  render() {
    return (
      <Map
        ref="Gmap"
        item
        xs={12}
        google={this.props.google}
        onClick={this.onClick}
        zoom={14}
        initialCenter={this.props.userPos}
        disableDefaultUI={true}
      >
        {/* <SearchBox
          controlPosition={google.maps.ControlPosition.TOP_LEFT}
        /> */}
        <Marker ref="marker" position={this.props.userPos} />
      </Map>
    );
  }
  mounted() {

    this.gmap = this.refs.Gmap.map
    this.marker = this.refs.marker.marker
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDhfEwBKYpfnkGiGMNV44wkKBtxI_oH_lo'
})(GoogleMapsContainer);
