import * as React from 'react';
import { Component } from 'react-simplified';
import { GoogleApiWrapper, InfoWindow, Map, Marker, SearchBox } from 'google-maps-react';

export class GoogleMapsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    };
  }
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };
  onClick(t, map, coord) {
    const latLng = { lat: coord.latLng.lat(), lng: coord.latLng.lng() };
    this.props.updatePos(latLng);
    this.render();
  }
  render() {
    const style = {
      width: '100%',
      height: '100%'
    };
    return (
      <Map
        item
        xs={12}
        style={style}
        google={this.props.google}
        onClick={this.onClick}
        zoom={14}
        initialCenter={this.props.userPos}
        disableDefaultUI={true}
      >
        {/* <SearchBox
          controlPosition={google.maps.ControlPosition.TOP_LEFT}
        /> */}
        <Marker
          //onClick={this.onMarkerClick}
          title={'Changing Colors Garage'}
          position={this.state.clickPos}
          name={'Changing Colors Garage'}
        />
      </Map>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDhfEwBKYpfnkGiGMNV44wkKBtxI_oH_lo'
})(GoogleMapsContainer);
