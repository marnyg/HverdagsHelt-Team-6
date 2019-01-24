class Location {
  /**
   * Location is used for Google Map/Geolocation API integration.
   * Stores geo location data and truncated region, county and country names to which this location is located.
   */

  lat: number;
  lon: number;
  city: string; // Municipality
  region: string; // County
  country: string;

  /**
   *
   * @param lat North/south angle/coordinate of the given position of this location
   * @param lng East/west angle/coordinate of the given position of this location
   * @param city Name of region/municipality to which this location belongs
   * @param region Name of county to which this location belongs
   * @param country Name of country to which this location belongs
   */

  constructor(lat: number, lng: number, city: string, region: string, country: string) {
    this.lat = lat;
    this.lon = lng;
    this.city = city;
    this.region = region;
    this.country = country;
  }
}
export default Location;
