import axios from 'axios';
import Location from '../classes/Location.js';
const key = 'AIzaSyBfY2sQ7ZU-o-npnt8Ua5RSdV9-5ZCoriM';
class LocationService{
    getLocation(): Promise<Location>{
        return new Promise((resolve, reject) => {
            if(navigator.geolocation){
                this.getLocationCoords()
                    .then(latlng => {
                        this.geocodeLatLng(latlng.lat, latlng.lng)
                            .then(locationdata => {
                                //console.log('Got location by browser navigator');
                                //console.log('Line 14: nodata', locationdata.results[0]);
                                if(locationdata.results){
                                    if(locationdata.results.length > 0){
                                        //console.log('found a location!');
                                        //console.log('Line 18: ', location.data);
                                        let lat = locationdata.results[0].geometry.location.lat;
                                        let long = locationdata.results[0].geometry.location.lng;
                                        let city = locationdata.results[0].address_components[3].long_name;
                                        let region = locationdata.results[0].address_components[4].long_name;
                                        let country = locationdata.results[0].address_components[5].long_name;
                                        console.log(lat, long, city, region, country);
                                        resolve(new Location(lat, long, city, region, country));
                                    } else {
                                        reject({message: 'Navigator received no results on location query'});
                                    }
                                } else {
                                    reject({message: 'Navigator received no results on location query'});
                                }
                            })
                            .catch((error: Error) => {
                                reject(error);
                            });
                    })
                    .catch(error => {
                        // User denied access to location
                        this.getLocationByIP()
                            .then(location => {
                                //console.log(location);
                                //console.log('Line 41: ', location.city);
                                let city = location.city;
                                let region = location.regionName;
                                let country = location.country;
                                let lat = location.lat;
                                let long = location.lon;
                                console.log(lat, long, city, region, country);
                                resolve(new Location(lat, long, city, region, country));
                            })
                            .catch((error: Error) => reject(error));
                    });
            } else {
                // Navigator is not enabled in browser
                this.getLocationByIP()
                    .then(location => {
                        //console.log(location);
                        console.log('Line 56: ', location.data);
                        let city = location.data.city;
                        let region = location.data.regionName;
                        let country = location.data.country;
                        let lat = location.data.lat;
                        let long = location.data.lon;
                        resolve(new Location(lat, long, city, region, country));
                    })
                    .catch((error: Error) => reject(error));
            }
        });

    }

    getLocationByIP(): Promise<any> {
        return axios.get('http://ip-api.com/json');
    }

    getLocationCoords(){
        return new Promise((resolve, reject) => {
            var location_timeout = setTimeout("geolocFail()", 10000);
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position) {
                    clearTimeout(location_timeout);

                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    resolve({lat: lat, lng: lng});

                }, function(error) {
                    clearTimeout(location_timeout);
                    reject(error);
                });
            } else {
                reject({message: 'Navigator is not enabled in the browser'});
            }
        });
    }

    geocodeLatLng(lat, lng): Promise<any>{
        //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
        return axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + lng + '&key=' + key);
    }

    geocodeCityCounty(city, county): Promise<any>{
        return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ city + ',region=' + county + '&key=' + key);
    }
}
export default LocationService;