class Location{
    latitude: number;
    longitude: number;
    city: string;
    region: string;
    country: string;

    constructor(lat, lng, city, region, country){
        this.latitude = lat;
        this.longitude = lng;
        this.city = city;
        this.region = region;
        this.country = country;
    }
}
export default Location;