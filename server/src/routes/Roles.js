// @flow

import { Role } from '../models.js';
import { regexNames } from './../utils/Regex.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllRoles: function(req: Request, res: Response) {
    return Role.findAll().then(roles => res.send(roles));
  },
  addRole: function(req: Request, res: Response) {
    if (
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
  updateRole: function(req: Request, res: Response) {
    if (
      !req.body ||
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
      { where: { role_id: req.params.role_id } }
    )
      .then(roles => (roles ? res.send(roles) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede en rolle med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  delRole: function(req: Request, res: Response) {
    return Role.destroy({ where: { role_id: Number(req.params.role_id) } })
      .then(role => (role ? res.send() : res.status(500).send()))
      .catch(err => {
        err.description = 'Rollen kan ikke slettes, fordi det finnes brukere med denne rollen. Fiks det først';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  }
};
