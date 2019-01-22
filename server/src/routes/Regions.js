// @flow

import { Region, User } from '../models.js';
import County from './Counties';
import { regexNames } from '../utils/Regex';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllRegionsInCounty: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.county_id))) return res.sendStatus(400);
    return Region.findAll({ where: { county_id: Number(req.params.county_id) } }).then(
      regions => (regions ? res.send(regions) : res.sendStatus(404))
    );
  },
  getAllRegions: function(req: Request, res: Response) {
    return Region.findAll().then(regions => res.send(regions));
  },
  addRegion: function(req: Request, res: Response) {
    if (
      !req.body ||
      typeof req.body.name !== 'string' ||
      typeof req.body.lat !== 'number' ||
      typeof req.body.lon !== 'number' ||
      typeof req.body.county_id !== 'number' ||
      !regexNames.test(req.body.name)
    )
      return res.sendStatus(400);
    return Region.create({
      name: req.body.name,
      lat: req.body.lat,
      lon: req.body.lon,
      county_id: req.body.county_id
    }).then(regions => (regions ? res.send(regions) : res.sendStatus(404)));
  },
  getRegion: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.region_id))) return res.sendStatus(400);
    return Region.findOne({ where: { region_id: Number(req.params.region_id) } }).then(
      region => (region ? res.send(region) : res.sendStatus(404))
    );
  },
  updateRegion: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.params ||
      isNaN(Number(req.params.region_id)) ||
      typeof req.body.name !== 'string' ||
      typeof req.body.lat !== 'number' ||
      typeof req.body.lon !== 'number' ||
      typeof req.body.county_id !== 'number' ||
      !regexNames.test(req.body.name)
    )
      return res.sendStatus(400);

    return Region.update(
      {
        name: req.body.name,
        lat: req.body.lat,
        lon: req.body.lon,
        county_id: req.body.county_id
      },
      { where: { region_id: Number(req.params.region_id) } }
    ).then(regions => (regions ? res.send(regions) : res.sendStatus(404)));
  },
  delRegion: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.region_id))) return res.sendStatus(400);

    return Region.destroy({ where: { region_id: Number(req.params.region_id) } })
      .then(regions => (regions ? res.send() : res.status(500).send()))
      .catch(err => {
        err.description =
          'Kommunen kan ikke slettes, fordi det er brukere og/eller saker knyttet til den. Slett disse først.';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },

  getRegionStaff: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.region_id))) return res.sendStatus(400);

    User.findAll({
      where: {
        region_id: Number(req.params.region_id),
        role_id: 2
      }
    })
      .then(users => {
        return res.send(users);
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json(error);
      });
  }
};
