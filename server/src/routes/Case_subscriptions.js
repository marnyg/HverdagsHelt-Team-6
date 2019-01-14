// @flow

import { Case_subscriptions } from '../models';
import { verifyToken } from '../auth';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllCase_subscriptions: function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.user_id ||
      typeof Number(req.params.user_id) !== 'number' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    return Case_subscriptions.findAll({
      where: {
        user_id: req.params.user_id
      }
    }).then(cases => res.send(cases));
  },
  addCase_subscriptions: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.token ||
      typeof req.body.user_id !== 'number' ||
      typeof req.body.notify_by_email !== 'boolean' ||
      typeof req.body.is_up_to_date !== 'boolean' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = req.body.user_id;

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    return Case_subscriptions.create({
      user_id: req.body.user_id,
      case_id: Number(req.params.case_id),
      notify_by_email: req.body.notify_by_email,
      is_up_to_date: req.body.is_up_to_date
    }).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
  },
  updateCase_subscriptions: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.token ||
      typeof req.body.user_id !== 'number' ||
      typeof req.body.notify_by_email !== 'boolean' ||
      typeof req.body.is_up_to_date !== 'boolean' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = req.body.user_id;

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    return Case_subscriptions.update(
      {
        notify_by_email: req.body.notify_by_email,
        is_up_to_date: req.body.is_up_to_date
      },
      {
        where: { case_id: Number(req.params.case_id), user_id: Number(req.body.user_id) }
      }
    ).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
  },
  delCase_subscriptions: function(req: Request, res: Response) {
    if (!req.token || !req.body.user_id || typeof req.token !== 'string') return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = req.body.user_id;

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    return Case_subscriptions.destroy({
      where: { case_id: Number(req.params.case_id), user_id: Number(req.body.user_id) }
    }).then(cases => (cases ? res.send() : res.status(500).send()));
  }
};
