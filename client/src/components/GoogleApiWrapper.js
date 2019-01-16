import * as React from 'react';
import { Component } from 'react-simplified';
import { GoogleApiWrapper, InfoWindow, Map, Marker, SearchBox } from 'google-maps-react';

export class GoogleMapsContainer extends Component {
  onClick(t, map, coord) {
    const latLng = { lat: coord.latLng.lat(), lon: coord.latLng.lng() };
    this.props.updatePos(latLng);

  }

  componentDidUpdate(prevProps) {
    if (prevProps.centerPos !== this.props.centerPos) {
      this.gmap.panTo(this.props.markerPos);
      this.marker.setPosition(this.props.centerPos)
    }
    this.gmap.draggable = this.props.isClickable
    this.gmap.onClick = this.props.isClickable ? (t, map, coord) => this.onClick(t, map, coord) : null;
  }



  render() {
    return (
      <Map
        ref="Gmap"
        item
        xs={12}
        google={this.props.google}
        onClick={this.props.isClickable ? (t, map, coord) => this.onClick(t, map, coord) : null}
        zoom={14}
        initialCenter={this.props.markerPos}
        // disableDefaultUI={true}
        streetViewControl={false}

        draggable={this.props.isClickable}
      >
        {/* <SearchBox
          controlPosition={google.maps.ControlPosition.TOP_LEFT}
        /> */}
        <Marker ref="marker" position={this.props.markerPos} />
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
