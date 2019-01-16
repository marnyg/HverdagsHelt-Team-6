class Picture {
  picture_id: number;
  case_id: number;
  src: string;
  alt: string;
  value: any;

  constructor(picture_id, case_id, src, alt, value){
    this.picture_id = picture_id;
    this.case_id = case_id;
    this.src = path;
    this.alt = alt;
    this.value = value;
  }
}
export default Picture;
