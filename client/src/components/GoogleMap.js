import {Component} from "react-simplified";

export class NewCase extends Component {
	gmap = null;
	pos = { lat: 59.9138688, lon: 10.752245399999993 };
	
	render() {
		return (
			<div id={"gmap"}>
			
			</div>
		);
	}
	
	mounted() {
		
		console.log('Mounted!');
		// Fetching counties logic here
	}
}