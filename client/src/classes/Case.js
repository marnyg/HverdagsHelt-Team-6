import Picture from './Picture.js';
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
  img: Picture[];

  constructor(case_id, region_id, user_id, category_id, status_id, createdBy, title, description, status_name, region_name, county_name, category_name, createdAt, updatedAt, lat, lon){
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
