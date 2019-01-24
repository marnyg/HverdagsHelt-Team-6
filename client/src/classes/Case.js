import Picture from './Picture.js';

/**
 * Case is a data object who's purpose is aggregate data flow throughout the webpage.
 * Case enables state driven data mutation and export because all data related to a case is stored
 * in a Case object.
 */

class Case {
  case_id: number;
  region_id: number;
  user_id: number;
  category_id: number;
  status_id: number;
  createdBy: string; // Navnet på eieren (user_id)
  title: string;
  description: string;
  status_name: string;
  region_name: string;
  county_name: string;
  category_name: string;
  createdAt: string;
  updatedAt: string;
  lat: number;
  lon: number;
  img: Picture[] = [];

  /**
   *
   * @param case_id ID number for this case object
   * @param region_id ID number for the region associated with this case
   * @param user_id ID number of the owner/creator of this case
   * @param category_id ID number of the category which most closely identifies this case
   * @param status_id ID number of the current status of this case
   * @param createdBy full name of the owner/creator of this case
   * @param title The title of the case
   * @param description The description of this case
   * @param status_name Name of the current status of this case
   * @param region_name Name of region to which this case belongs
   * @param county_name Name of county to which the region of which this case belongs to belongs
   * @param category_name Name of the category which most closely identifies this case
   * @param createdAt Date time when this case was inserted and accepted in the database
   * @param updatedAt Data time when this case was most recently updated in the database
   * @param lat North/south angle/coordinate of the given position of this case
   * @param lon East/west angle/coordinate of the given position of this case
   */
  constructor(
    case_id,
    region_id,
    user_id,
    category_id,
    status_id,
    createdBy,
    title,
    description,
    status_name,
    region_name,
    county_name,
    category_name,
    createdAt,
    updatedAt,
    lat,
    lon
  ) {
    this.case_id = case_id;
    this.region_id = region_id;
    this.user_id = user_id;
    this.category_id = category_id;
    this.status_id = status_id;
    this.createdBy = createdBy;
    this.title = title;
    this.description = description;
    this.status_name = status_name;
    this.region_name = region_name;
    this.county_name = county_name;
    this.category_name = category_name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lat = lat;
    this.lon = lon;
    this.img = [];
  }
}
export default Case;
