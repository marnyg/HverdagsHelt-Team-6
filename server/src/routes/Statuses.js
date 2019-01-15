// @flow

import { Status } from '../models.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllStatuses: function(req: Request, res: Response) {
    return Status.findAll().then(statuses => res.send(statuses));
  },
  addStatus: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string') return res.sendStatus(400);
    return Status.create({
      name: req.body.name
    }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
  },
  updateStatus: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string') return res.sendStatus(400);
    return Status.update(
      {
        name: req.body.name
      },
      { where: { status_id: req.params.status_id } }
    ).then(status => (status ? res.send(status) : res.sendStatus(404)));
  },
  delStatus: function(req: Request, res: Response) {
    return Status.destroy({ where: { status_id: Number(req.params.status_id) } }).then(status =>
      status ? res.send() : res.status(500).send()
    );
  }
};
