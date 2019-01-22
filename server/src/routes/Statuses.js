// @flow

import { Status } from '../models.js';
import { regexNames } from './../utils/Regex.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllStatuses: function(req: Request, res: Response) {
    return Status.findAll().then(statuses => res.send(statuses));
  },
  addStatus: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string' || !regexNames.test(req.body.name)) return res.sendStatus(400);
    return Status.create({
      name: req.body.name
    })
      .then(stat => (stat ? res.send(stat) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede en status med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  updateStatus: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string' || !regexNames.test(req.body.name)) return res.sendStatus(400);
    return Status.update(
      {
        name: req.body.name
      },
      { where: { status_id: req.params.status_id } }
    )
      .then(status => (status ? res.send(status) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede en status med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  delStatus: function(req: Request, res: Response) {
    return Status.destroy({ where: { status_id: Number(req.params.status_id) } })
      .then(status => (status ? res.send() : res.status(500).send()))
      .catch(err => {
        err.description = 'Statusen kan ikke slettes, fordi den brukes av minst en status kommentar. Fiks dette først';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  }
};
