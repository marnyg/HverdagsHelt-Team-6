class Role {
  /**
   * Mimics the Roles table in the database. Enables effective type-checking.
   */

  role_id: number;
  name: string;
  access_level: number;

  /**
   *
   * @param role_id ID number that uniquely identifies this role.
   * @param name Descriptive name of this role
   * @param access_level Privilege level accosiated with this role. Lower number means higher privilege.
   */

  constructor(role_id, name, access_level) {
    this.role_id = role_id;
    this.name = name;
    this.access_level = access_level;
  }
}
export default Role;
