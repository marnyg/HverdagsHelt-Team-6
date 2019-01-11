class User {
  user_id: number;
  role_id: number;
  region_id: number;
  firstname: string;
  lastname: string;
  tlf: number;
  email: string;
  hash_password: string;
  salt: string;


  constructor(user_id, role_id, region_id, firstname, lastname, tlf, email, hash_password, salt){
    this.user_id = user_id;
    this.role_id = role_id;
    this.region_id = region_id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.tlf = tlf;
    this.email = email;
    this.hash_password = hash_password;
    this.salt = salt;
  }
}
export default User;
