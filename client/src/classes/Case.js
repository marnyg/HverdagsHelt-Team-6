class Case {
  case_id: number;
  region_id: number;
  user_id: number;
  category_id: number;
  status_id: number;
  title: string;
  description: string;
  created_at: any;
  updated_at: any;
  lat: number;
  lon: number;

  constructor(case_id, region_id, user_id, category_id, status_id, title, description, created_at, updated_at, lat, lon){
    this.case_id = case_id;
    this.region_id = region_id;
    this.user_id = user_id;
    this.category_id = category_id;
    this.status_id = status_id;
    this.title = title;
    this.description = description;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.lat = lat;
    this.lon = lon;
  }
}
export default Case;
