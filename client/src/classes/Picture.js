class Picture {
  picture_id: number;
  case_id: number;
  path: string;
  alt: string;

  constructor(picture_id, case_id, path, alt){
    this.picture_id = picture_id;
    this.case_id = case_id;
    this.path = path;
    this.alt = alt;
  }
}
export default Picture;
