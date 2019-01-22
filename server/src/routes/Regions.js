// @flow

import { Region, User } from '../models.js';
import County from './Counties';
import { regexNames } from '../utils/Regex';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllRegionsInCounty: function(req: Request, res: Response) {
    return Region.findAll({ where: { county_id: Number(req.params.county_id) } }).then(regions =>
      regions ? res.send(regions) : res.sendStatus(404)
    );
  },
  getRegionName: function(req: Request, res: Response) {
    return Region.findOne({ where: { region_id: res.body.region_id }, attributes: ['name'] }).then(name =>
      name ? res.send(name) : res.sendStatus(404)
    );
  },
  getOneRegionByNameAndCounty: async function(req: Request, res: Response) {
    let c_id = await County.getOneCountyByName(req, res);
    let countyId = c_id ? c_id : res.sendStatus(404);
    return Region.findOne({
      where: { name: req.params.region_name, county_id: Number(countyId.county_id) },
      attributes: ['region_id']
    }).then(regions => (regions ? regions : res.sendStatus(404)));
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
    return Region.findOne({ where: { region_id: Number(req.params.region_id) } }).then(region =>
      region ? res.send(region) : res.sendStatus(404)
    );
  },
  updateRegion: function(req: Request, res: Response) {
    let region_id = Number(req.params.region_id);
    if (
      !req.body ||
      typeof region_id !== 'number' ||
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
      { where: { region_id: region_id } }
    ).then(regions => (regions ? res.send(regions) : res.sendStatus(404)));
  },
  delRegion: function(req: Request, res: Response) {
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
    if (!req.params || typeof Number(req.params.region_id) != 'number') return res.sendStatus(400);

    const region_id = Number(req.params.region_id);
    User.findAll({
      where: {
        region_id: region_id,
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
