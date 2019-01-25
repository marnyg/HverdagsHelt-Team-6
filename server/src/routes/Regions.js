// @flow

import { Region, User } from '../models.js';
import County from './Counties';
import { regexNames } from '../utils/Regex';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  /**
   * Get all region belonging to given county
   * @param req Request
   * @param res Response
   * @returns {Region}
   */
  getAllRegionsInCounty: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.county_id))) return res.sendStatus(400);
    return Region.findAll({ where: { county_id: Number(req.params.county_id) } }).then(regions =>
      regions ? res.send(regions) : res.sendStatus(404)
    );
  },
  /**
   * Get all regions
   * @param req Request
   * @param res Response
   * @returns {Region}
   */
  getAllRegions: function(req: Request, res: Response) {
    return Region.findAll().then(regions => res.send(regions));
  },
  /**
   * Add a new region
   * @param req Request
   * @param res Response
   * @returns {Region}
   */
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
  /**
   * Get a region, given region_id
   * @param req Request
   * @param res Response
   * @returns {Region}
   */
  getRegion: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.region_id))) return res.sendStatus(400);
    return Region.findOne({ where: { region_id: Number(req.params.region_id) } }).then(region =>
      region ? res.send(region) : res.sendStatus(404)
    );
  },
  /**
   * Update a region
   * @param req Request
   * @param res Response
   * @returns {Region}
   */
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
  /**
   * Delete a region
   * @param req Request
   * @param res Response
   * @returns {*}
   */
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
  /**
   * Get all employees working in a region
   * @param req Request
   * @param res Response
   * @returns {User}
   */
  getRegionStaff: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.region_id))) return res.sendStatus(400);

    User.findAll({
      where: {
        region_id: Number(req.params.region_id),
        role_id: 2
      }
    })
      .then(users => {
        let my_users;
        if (users) {
          my_users = [...users];
          my_users.forEach(user => {
            console.log(user);
            delete user.dataValues['hashed_password'];
            delete user.dataValues['salt'];
          });
          return res.send(my_users);
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json(error);
      });
  }
};
