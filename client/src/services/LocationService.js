import axios from 'axios';
import Location from '../classes/Location.js';
import ToolService from "./ToolService";
const key = 'AIzaSyBfY2sQ7ZU-o-npnt8Ua5RSdV9-5ZCoriM';
class LocationService {
    /**
     * Get a location, using geolocation
     * @returns {Promise<Location>}
     */
    getLocation(): Promise<Location> {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                this.getLocationCoords()
                    .then(latlng => {
                        this.geocodeLatLng(latlng.lat, latlng.lng)
                            .then(locationdata => {
                                //console.log('Got location by browser navigator');
                                //console.log('Line 14: nodata', locationdata.results[0]);
                                if (locationdata.results) {
                                    if (locationdata.results.length > 0) {
                                        //console.log('found a location!');
                                        //console.log('Line 18: ', location.data);
                                        let lat = locationdata.results[0].geometry.location.lat;
                                        let long = locationdata.results[0].geometry.location.lng;
                                        let city = locationdata.results[0].address_components.find(e => e.types[0] === "administrative_area_level_2").long_name;
                                        let region = locationdata.results[0].address_components.find(e => e.types[0] === "administrative_area_level_1").long_name;
                                        let country = locationdata.results[0].address_components.find(e => e.types[0] === "country").long_name;
                                        //
                                        // console.log(lat, long, city, region, country);
                                        ToolService.cleanQueryString(city);
                                        ToolService.cleanQueryString(region);
                                        resolve(new Location(lat, long, city, region, country));
                                    } else {
                                        reject({ message: 'Navigator received no results on location query' });
                                    }
                                } else {
                                    reject({ message: 'Navigator received no results on location query' });
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
                                //console.log(lat, long, city, region, country);
                                ToolService.cleanQueryString(city);
                                ToolService.cleanQueryString(region);
                                resolve(new Location(lat, long, city, region, country));
                            })
                            .catch((error: Error) => reject(error));
                    });
            } else {
                // Navigator is not enabled in browser
                this.getLocationByIP()
                    .then(location => {
                        //console.log(location);
                        //console.log('Line 56: ', location.data);
                        let city = location.data.city;
                        let region = location.data.regionName;
                        let country = location.data.country;
                        let lat = location.data.lat;
                        let long = location.data.lon;
                        ToolService.cleanQueryString(city);
                        ToolService.cleanQueryString(region);
                        resolve(new Location(lat, long, city, region, country));
                    })
                    .catch((error: Error) => reject(error));
            }
        });

    }

    /**
     * Get a location, using IP address
     * @returns {AxiosPromise<any>}
     */
    getLocationByIP(): Promise<any> {
        return axios.get('http://ip-api.com/json');
    }

    /**
     * Get coordinates (latitude & longitude)
     * @returns {Promise<any>}
     */
    getLocationCoords() {
        return new Promise((resolve, reject) => {
            var location_timeout = setTimeout(() => { reject('GPS timed out') }, 10000);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    clearTimeout(location_timeout);

                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    resolve({ lat: lat, lng: lng });

                }, function (error) {
                    clearTimeout(location_timeout);
                    reject(error);
                });
            } else {
                reject({ message: 'Navigator is not enabled in the browser' });
            }
        });
    }

    /**
     * Get geocode, given latitude and longitude
     * @param lat
     * @param lng
     * @returns {AxiosPromise<any>}
     */
    geocodeLatLng(lat, lng): Promise<any> {
        //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
        return axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + key);
    }

    /**
     * Get geocode, given city and county
     * @param city
     * @param county
     * @returns {AxiosPromise<any>}
     */
    geocodeCityCounty(city, county): Promise<any> {
        return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',region=' + county + '&key=' + key);
    }

    /**
     * Errorhandler for geolacation errors
     * @returns {Error}
     */
    geolocFail() {
        return new Error('Geolocation failed');
    }
}
export default LocationService;