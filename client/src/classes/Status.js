class Status {
  /**
   * Mimics the Statuses table in the database.
   */

  status_id: number;
  name: string;

  /**
   *
   * @param status_id ID number that uniquely identifies this status.
   * @param name Descriptive name of this status.
   */

  constructor(status_id, name) {
    this.status_id = status_id;
    this.name = name;
  }
}

export default Status;
