class Region {
  /**
   * Mimics the Region table in the database. Enables effective type-checking.
   */

  region_id: number;
  county_id: number;
  name: string;
  lat: number;
  lon: number;

  /**
   *
   * @param region_id ID number associated with this region.
   * @param county_id ID number of county to which this region belongs.
   * @param name The name of this region.
   * @param lat North/south angle/coordinate that arbitarily identifies this regions expected centre.
   * @param lon East/west angle/coordinate that arbitarily identifies this regions expected centre.
   */

  constructor(region_id, county_id, name, lat, lon) {
    this.region_id = region_id;
    this.county_id = county_id;
    this.name = name;
    this.lat = lat;
    this.lon = lon;
  }
}
export default Region;
