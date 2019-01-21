class Location{
    lat: number;
    lon: number;
    city: string; // Municipality
    region: string; // County
    country: string;

    constructor(lat: number, lng: number, city: string, region: string, country: string){
        this.lat = lat;
        this.lon = lng;
        this.city = city;
        this.region = region;
        this.country = country;
    }
}
export default Location;