//@flow
class User {
  /**
   * Data flow object used to conceptualize a user. Enables effective type-checking.
   */

  user_id: number;
  role_id: number;
  region_id: number;
  firstname: string;
  lastname: string;
  tlf: number;
  email: string;
  password: string;

  /**
   *
   * @param user_id ID number that uniquely identifies this user.
   * @param role_id ID number that uniquely identifies this user's role.
   * @param region_id ID number that uniquely identifies this users home municipality.
   * @param firstname Users registered first name.
   * @param lastname Users registered last name.
   * @param tlf User registered phone number.
   * @param email Users registered e-mail address.
   * @param password Users provided password during the registration process.
   */

  constructor(
    user_id: number,
    role_id: number,
    region_id: number,
    firstname: string,
    lastname: string,
    tlf: number,
    email: string,
    password: string
  ) {
    this.user_id = user_id;
    this.role_id = role_id;
    this.region_id = region_id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.tlf = tlf;
    this.email = email;
    this.password = password;
  }
}
export default User;
