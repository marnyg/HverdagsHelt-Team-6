//@flow
class User {
  user_id: number;
  role_id: number;
  region_id: number;
  firstname: string;
  lastname: string;
  tlf: number;
  email: string;
  password: string;

  constructor(user_id: number, role_id: number, region_id: number, firstname: string, lastname: string, tlf: number, email: string, password: string){
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
