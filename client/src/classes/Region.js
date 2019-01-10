class Region {
  region_id: number;
  county_id: number;
  name: string;
  lat: number;
  lon: number;

  constructor(region_id, county_id, name, lat, lon){
    this.region_id = region_id;
    this.county_id = county_id;
    this.name = name;
    this.lat = lat;
    this.lon = lon;
  }
}
export default Region;
