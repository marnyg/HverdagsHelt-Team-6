// @flow

import { County, sequelize } from '../models.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllCounties: function(req: Request, res: Response) {
    return County.findAll().then(counties => res.send(counties));
  },
  getOneCountyByName: function(req: Request, res: Response) {
    return County.findOne({ where: { name: req.params.county_name }, attributes: ['county_id'] }).then(counties =>
      counties ? counties : res.sendStatus(404)
    );
  },
  addCounty: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string') return res.sendStatus(400);
    return County.create({
      name: req.body.name
    })
      .then(counties => (counties ? res.send(counties) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede et fylke med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
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
    )
      .then(counties => (counties ? res.send(counties) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede et fylke med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  delCounty: function(req: Request, res: Response) {
    return County.destroy({ where: { county_id: Number(req.params.county_id) } })
      .then(counties => (counties ? res.send() : res.status(500).send()))
      .catch(err => {
        err.description =
          'Fylket har en eller flere kommuner knyttet til seg, slett eller endre disse før du sletter fylket.';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  }
};
