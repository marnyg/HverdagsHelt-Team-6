// @flow

import { Role } from '../models.js';
import { regexNames } from './../utils/Regex.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  /**
   * Get all roles
   * @param req Request
   * @param res Response
   * @returns {Role}
   */
  getAllRoles: function(req: Request, res: Response) {
    if (!req.token) return res.sendStatus(400);
    return Role.findAll().then(roles => res.send(roles));
  },
  /**
   * Add a new role
   * @param req Request
   * @param res Response
   * @returns {Role}
   */
  addRole: function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.body ||
      typeof req.body.name !== 'string' ||
      typeof req.body.access_level !== 'number' ||
      !regexNames.test(req.body.name)
    )
      return res.sendStatus(400);

    return Role.create({
      name: req.body.name,
      access_level: req.body.access_level
    })
      .then(roles => (roles ? res.send(roles) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede en rolle med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  /**
   * Update a role
   * @param req Request
   * @param res Response
   * @returns {Role}
   */
  updateRole: function(req: Request, res: Response) {
    if (
      !req.params ||
      !req.body ||
      isNaN(Number(req.params.role_id)) ||
      typeof req.body.name !== 'string' ||
      typeof req.body.access_level !== 'number' ||
      !regexNames.test(req.body.name)
    )
      return res.sendStatus(400);

    return Role.update(
      {
        name: req.body.name,
        access_level: req.body.access_level
      },
      { where: { role_id: Number(req.params.role_id) } }
    )
      .then(roles => (roles ? res.send(roles) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede en rolle med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  /**
   * Delete a role
   * @param req Request
   * @param res Response
   * @returns {*}
   */
  delRole: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.role_id))) return res.sendStatus(400);

    return Role.destroy({ where: { role_id: Number(req.params.role_id) } })
      .then(role => (role ? res.send() : res.status(500).send()))
      .catch(err => {
        err.description = 'Rollen kan ikke slettes, fordi det finnes brukere med denne rollen. Fiks det først';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  }
};
