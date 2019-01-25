class County {
  /**
   * County mimics the County table in the database. Enables effective type-checking.
   */

  county_id: number;
  name: string;

  /**
   *
   * @param county_id ID number of which this county is to be associated
   * @param name The name of this county
   */

  constructor(county_id, name) {
    this.county_id = county_id;
    this.name = name;
  }
}
export default County;
