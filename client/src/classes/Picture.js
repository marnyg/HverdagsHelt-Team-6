class Picture {
  
  /**
   * Aggregate image object class. Used for data flow of image data and image meta data.
   */
  
  picture_id: number;
  case_id: number;
  src: string;
  alt: string;
  value: any;
  
  /**
   *
   * @param picture_id ID number associated with this image
   * @param case_id ID number of the case to which this picture is associated
   * @param src URL-resource of this picture
   * @param alt Provided alternative text for this image
   * @param value Image data. Binary file.
   */
  
  constructor(picture_id, case_id, src, alt, value){
    this.picture_id = picture_id;
    this.case_id = case_id;
    this.src = path;
    this.alt = alt;
    this.value = value;
  }
}
export default Picture;
