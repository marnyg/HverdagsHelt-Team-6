// @flow

import { Region_subscriptions } from '../models.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllRegion_subscriptions: function(req: Request, res: Response) {
    return Region_subscriptions.findAll().then(subs => res.send(subs));
  },
  addRegion_subscriptions: function(req: Request, res: Response) {
    let region_id = Number(req.params.region_id);
    if (
      !req.body ||
      typeof req.body.user_id !== 'number' ||
      typeof region_id !== 'number' ||
      typeof req.body.notify !== 'boolean'
    )
      return res.sendStatus(400);

    return Region_subscriptions.create({
      user_id: req.body.user_id,
      region_id: Number(req.params.region_id),
      notify: req.body.notify
    }).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
  },
  updateRegion_subscriptions: function(req: Request, res: Response) {
    let region_id = Number(req.params.region_id);
    if (
      !req.body ||
      typeof req.body.user_id !== 'number' ||
      typeof region_id !== 'number' ||
      typeof req.body.notify !== 'boolean'
    )
      return res.sendStatus(400);
    return Region_subscriptions.update(
      {
        notify: req.body.notify
      },
      { where: { region_id: region_id, user_id: req.body.user_id } }
    ).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
  },
  delRegion_subscriptions: function(req: Request, res: Response) {
    return Region_subscriptions.destroy({
      where: { region_id: Number(req.params.region_id), user_id: req.body.user_id }
    }).then(region => (region ? res.send() : res.status(500).send()));
  }
};
