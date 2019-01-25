class Category {
  
  /**
   * Category mimics the category table in the corresponding database. Enables effective type-checking.
   */
  
  category_id: number;
  name: string;
  
  /**
   *
   * @param category_id ID number to which this category is to be associated
   * @param name The name of this category
   */
  constructor(category_id, name){
    this.category_id = category_id;
    this.name = name;
  }
}
export default Category;
