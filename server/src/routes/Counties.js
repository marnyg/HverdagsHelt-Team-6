// @flow

import { County, sequelize } from '../models.js';
import { regexNames } from '../utils/Regex';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  /**
   * Get all counties
   * @param req Request
   * @param res Response
   * @returns {County}
   */
  getAllCounties: function(req: Request, res: Response) {
    return County.findAll().then(counties => res.send(counties));
  },
  /**
   * Get a county with given name
   * @param req Request
   * @param res Response
   * @returns {County}
   */
  getOneCountyByName: function(req: Request, res: Response) {
    if (!req.params || !isNaN(Number(req.params.county_name))) return res.sendStatus(400);
    return County.findOne({ where: { name: req.params.county_name }, attributes: ['county_id'] }).then(counties =>
      counties ? res.send(counties) : res.sendStatus(404)
    );
  },
  /**
   * Add a new county
   * @param req Request
   * @param res Response
   * @returns {County}
   */
  addCounty: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string' || !regexNames.test(req.body.name)) return res.sendStatus(400);
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
  /**
   * Updates one county
   * @param req Request
   * @param res Response
   * @returns {County}
   */
  updateCounty: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.params ||
      isNaN(Number(req.params.county_id)) ||
      typeof req.body.name !== 'string' ||
      !regexNames.test(req.body.name)
    )
      return res.sendStatus(400);
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
  /**
   * Deletes one county with given county_id
   * @param req
   * @param res
   * @returns {*}
   */
  delCounty: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.county_id))) return res.sendStatus(400);
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
