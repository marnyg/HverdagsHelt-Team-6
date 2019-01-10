import * as React from 'react';
import { Component } from 'react-simplified'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';

export class GoogleMapsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        }
    }
    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }
    onClick(t, map, coord) {

        const latLng = coord.pa;
        console.log(latLng);
    }
    render() {
        const style = {
            width: '90%',
            height: '75vh',
        }
        return (
            <Map
                item
                xs={12}
                style={style}
                google={this.props.google}
                onClick={this.onClick}
                zoom={14}
                initialCenter={{ lat: 39.648209, lng: -75.711185 }}
            >
                <Marker
                    onClick={this.onMarkerClick}
                    title={'Changing Colors Garage'}
                    position={{ lat: 39.648209, lng: -75.711185 }}
                    name={'Changing Colors Garage'}
                />
            </Map>
        );
    }
}
export default GoogleApiWrapper({
    apiKey: "AIzaSyDhfEwBKYpfnkGiGMNV44wkKBtxI_oH_lo"
})(GoogleMapsContainer)