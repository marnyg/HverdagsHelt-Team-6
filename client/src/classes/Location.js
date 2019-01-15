class Location{
    lat: number;
    lon: number;
    city: string;
    region: string;
    country: string;

    constructor(lat, lng, city, region, country){
        this.lat = lat;
        this.lon = lng;
        this.city = city;
        this.region = region;
        this.country = country;
    }
}
export default Location;