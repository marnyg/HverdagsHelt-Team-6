class Role {
  role_id: number;
  name: string;
  access_level: number;

  constructor(role_id, name, access_level){
    this.role_id = role_id;
    this.name = name;
    this.access_level = access_level;
  }
}
export default Role;
