
import * as React from 'react';
import { Component } from 'react-simplified';
import { DumMap } from "./dumMap";

export class GoogleMap extends Component {

	render() {
		return (
			<DumMap
				doctors={this.props.doctors}
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDhfEwBKYpfnkGiGMNV44wkKBtxI_oH_lo&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `600px`, width: `600px` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
		);
	}
}