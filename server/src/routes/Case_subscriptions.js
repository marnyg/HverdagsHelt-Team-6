// @flow

import { Case_subscriptions, Picture, sequelize } from '../models';
import { verifyToken } from '../auth';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  /**
   * Get all Case_subscription entries
   * @param req, Request
   * @param res, Response
   * @returns {Case_subscriptions}
   */
  getAllCase_subscriptions: function(req: Request, res: Response) {
    if (!req.token || !req.params.user_id || isNaN(Number(req.params.user_id)) || typeof req.token !== 'string')
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

    return Case_subscriptions.findAll({
      where: {
        user_id: req.params.user_id
      }
    }).then(cases => res.send(cases));
  },
  /**
   * Get all case items connected to Case_subscription entries
   * @param req Request
   * @param res Response
   * @returns {Promise<Response>}
   */
  getAllCase_subscriptionCases: async function(req: Request, res: Response) {
    if (!req.token || !req.params.user_id || isNaN(Number(req.params.user_id)) || typeof req.token !== 'string')
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

    let page = 1;
    let limit = 20;

    if (req.query && req.query.page && req.query.limit && Number(req.query.page) > 0 && Number(req.query.limit) > 0) {
      page = Number(req.query.page);
      limit = Number(req.query.limit);
    }
    let start_limit = (page - 1) * limit;

    sequelize
      .query(
        'Select c.case_id, c.title, c.description, c.lat, c.lon, c.user_id, ' +
          "CONCAT(u.firstname, ' ', u.lastname) as createdBy, u.tlf, u.email, " +
          'co.county_id, co.name AS county_name, ' +
          'c.region_id, r.name as region_name, ' +
          'c.status_id, s.name as status_name, ' +
          'c.category_id, cg.name as category_name, ' +
          'c.createdAt, c.updatedAt ' +
          'FROM Case_subscriptions csubs JOIN Cases c ON csubs.case_id = c.case_id ' +
          'JOIN Regions r ON c.region_id = r.region_id ' +
          'Join Counties co ON r.county_id = co.county_id ' +
          'JOIN Users u ON c.user_id = u.user_id ' +
          'JOIN Statuses s ON c.status_id = s.status_id ' +
          'JOIN Categories cg ON c.category_id = cg.category_id ' +
          'WHERE csubs.user_id = ? Order By c.updatedAt DESC LIMIT ?,?',
        { replacements: [req.params.user_id, start_limit, limit], type: sequelize.QueryTypes.SELECT }
      )
      .then(async cases => {
        const out = cases.map(async c => {
          let pictures = await Picture.findAll({ where: { case_id: c.case_id }, attributes: ['path'] });
          c.img = pictures.map(img => img.path);
          return c;
        });
        return Promise.all(out).then(cases => (cases ? res.send(cases) : res.sendStatus(404)));
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  },
  /**
   * Add ned case subscription
   * @param req Request
   * @param res Response
   * @returns {Case_subscriptions}
   */
  addCase_subscriptions: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.token ||
      !req.params ||
      isNaN(Number(req.params.case_id)) ||
      typeof req.body.user_id !== 'number' ||
      typeof req.body.notify_by_email !== 'boolean' ||
      typeof req.body.is_up_to_date !== 'boolean' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = req.body.user_id;

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

    return Case_subscriptions.create({
      user_id: req.body.user_id,
      case_id: Number(req.params.case_id),
      notify_by_email: req.body.notify_by_email,
      is_up_to_date: req.body.is_up_to_date
    })
      .then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede et abonnement for denne brukeren, på den oppgitte saken';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  /**
   * Updates a Case_subscription
   * @param req Request
   * @param res Response
   * @returns {Case_subscriptions}
   */
  updateCase_subscriptions: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.token ||
      !req.params ||
      isNaN(Number(req.params.case_id)) ||
      typeof req.body.user_id !== 'number' ||
      (typeof req.body.notify_by_email !== 'boolean' && req.body.notify_by_email !== null) ||
      typeof req.body.is_up_to_date !== 'boolean' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = req.body.user_id;
    let case_sub_obj = {
      is_up_to_date: req.body.is_up_to_date
    };
    if (req.body.notify_by_email !== null) case_sub_obj['notify_by_email'] = req.body.notify_by_email;

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

    return Case_subscriptions.update(case_sub_obj, {
      where: { case_id: Number(req.params.case_id), user_id: req.body.user_id }
    }).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
  },
  /**
   * Deletes a Case_subscription
   * @param req Request
   * @param res Response
   * @returns {*}
   */
  delCase_subscriptions: function(req: Request, res: Response) {
    if (!req.token || !req.params || isNaN(Number(req.params.case_id)) || typeof req.token !== 'string')
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

    return Case_subscriptions.destroy({
      where: { case_id: Number(req.params.case_id), user_id: Number(req.params.user_id) }
    }).then(cases => (cases ? res.send() : res.status(500).send()));
  },
  /**
   * Get all not up to date Case_subscriptions
   * @param req Request
   * @param res Response
   * @returns {Promise<Response>}
   */
  getAllCase_subscriptionCasesIs_up_to_date: async function(req: Request, res: Response) {
    if (!req.token || !req.params.user_id || isNaN(Number(req.params.user_id)) || typeof req.token !== 'string')
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

    sequelize
      .query(
        'Select c.case_id, c.title, c.description, c.lat, c.lon, c.user_id, ' +
          "CONCAT(u.firstname, ' ', u.lastname) as createdBy, u.tlf, u.email, " +
          'co.county_id, co.name AS county_name, ' +
          'c.region_id, r.name as region_name, ' +
          'c.status_id, s.name as status_name, ' +
          'c.category_id, cg.name as category_name, ' +
          'c.createdAt, c.updatedAt ' +
          'FROM Case_subscriptions csubs JOIN Cases c ON csubs.case_id = c.case_id ' +
          'JOIN Regions r ON c.region_id = r.region_id ' +
          'Join Counties co ON r.county_id = co.county_id ' +
          'JOIN Users u ON c.user_id = u.user_id ' +
          'JOIN Statuses s ON c.status_id = s.status_id ' +
          'JOIN Categories cg ON c.category_id = cg.category_id ' +
          'WHERE csubs.user_id = ? AND csubs.is_up_to_date = false',
        { replacements: [req.params.user_id], type: sequelize.QueryTypes.SELECT }
      )
      .then(async cases => {
        const out = cases.map(async c => {
          let pictures = await Picture.findAll({ where: { case_id: c.case_id }, attributes: ['path'] });
          c.img = pictures.map(img => img.path);
          return c;
        });
        return Promise.all(out).then(cases => (cases ? res.send(cases) : res.sendStatus(404)));
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  }
};
