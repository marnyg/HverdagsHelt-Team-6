// @flow

import { Region_subscriptions } from '../models.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  /**
   * Get all region subscriptions
   * @param req Request
   * @param res Response
   * @returns {Region_subscriptions}
   */
  getAllRegion_subscriptions: function(req: Request, res: Response) {
    return Region_subscriptions.findAll().then(subs => res.send(subs));
  },
  /**
   * Add a new region subscription
   * @param req Request
   * @param res Response
   * @returns {Region_subscriptions}
   */
  addRegion_subscriptions: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.params ||
      isNaN(Number(req.params.region_id)) ||
      typeof req.body.user_id !== 'number' ||
      typeof req.body.notify !== 'boolean'
    )
      return res.sendStatus(400);

    return Region_subscriptions.create({
      user_id: req.body.user_id,
      region_id: Number(req.params.region_id),
      notify: req.body.notify
    })
      .then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede et abonnement for denne brukeren, på den oppgitte regionen';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  /**
   * Updates an existing region subscription
   * @param req Request
   * @param res Response
   * @returns {Region_subscriptions}
   */
  updateRegion_subscriptions: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.params ||
      isNaN(Number(req.params.region_id)) ||
      typeof Number(req.body.user_id) != 'number' ||
      typeof req.body.notify != 'boolean'
    )
      return res.sendStatus(400);
    return Region_subscriptions.update(
      {
        notify: req.body.notify
      },
      { where: { region_id: Number(req.params.region_id), user_id: req.body.user_id } }
    ).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
  },
  /**
   * Deletes a region subscriptions
   * @param req Request
   * @param res Response
   * @returns {*}
   */
  delRegion_subscriptions: function(req: Request, res: Response) {
    if (!req.body || !req.params || isNaN(Number(req.params.region_id)) || typeof req.body.user_id !== 'number')
      return res.sendStatus(400);
    return Region_subscriptions.destroy({
      where: { region_id: Number(req.params.region_id), user_id: req.body.user_id }
    }).then(region => (region ? res.send() : res.status(500).send()));
  }
};
