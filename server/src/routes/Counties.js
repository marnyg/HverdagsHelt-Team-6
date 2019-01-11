// @flow

import { County } from '../models.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllCounties: function(req: Request, res: Response) {
    return County.findAll().then(counties => res.send(counties));
  },
  addCounty: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string') return res.sendStatus(400);
    return County.create({
      name: req.body.name
    }).then(counties => (counties ? res.send(counties) : res.sendStatus(404)));
  },
  updateCounty: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string') return res.sendStatus(400);
    return County.update(
      {
        name: req.body.name
      },
      {
        where: { county_id: Number(req.params.county_id) }
      }
    ).then(counties => (counties ? res.send(counties) : res.sendStatus(404)));
  },
  delCounty: function(req: Request, res: Response) {
    return County.destroy({ where: { county_id: Number(req.params.county_id) } }).then(counties =>
      counties ? res.send() : res.status(500).send()
    );
  }
};
