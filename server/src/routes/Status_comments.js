// @flow

import { Case, Status_comment, User, sequelize, Case_subscriptions } from '../models';
import { verifyToken } from '../auth';
import { send_subs_email } from '../utils/Epost.js';

type Request = express$Request;
type Response = express$Response;

const email_subject = 'Oppdatering på sak!';
const email_body = `Det har kommet en oppdatering på saken med tittel 'blah blah'`;

let all_true = function(val) {
  return val === true;
};

module.exports = {
  getAllStatus_comment: async function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.case_id))) return res.sendStatus(400);

    let page = 1;
    let limit = 5;
    console.log(limit);
    if (req.query && req.query.page !== undefined && req.query.limit !== undefined) {
      page = Number(req.query.page);
      limit = Number(req.query.limit);
    }
    let limit_start = (page - 1) * limit;

    sequelize
      .query(
        'Select sc.status_comment_id, sc.comment, sc.createdAt, sc.updatedAt, sc.case_id, sc.status_id, sc.user_id, ' +
          "CONCAT(u.firstname, ' ', u.lastname) as createdBy, " +
          's.name AS status_name ' +
          'FROM Status_comments sc ' +
          'JOIN Users u ON sc.user_id = u.user_id ' +
          'JOIN Statuses s ON sc.status_id = s.status_id ' +
          'WHERE case_id = ? Order By sc.updatedAt DESC Limit ?,?;',
        {
          replacements: [Number(req.params.case_id), limit_start, limit],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(async result => {
        return res.send(result);
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  },
  // Back up code:
  // getAllStatus_comment: function(req: Request, res: Response) {
  //   return Status_comment.findAll({
  //     where: {
  //       case_id: req.params.case_id
  //     },
  //     order: [['updatedAt', 'DESC']] //Order by updatedAt????
  //   }).then(comments => res.send(comments));
  // },
  // Kun ansatt i riktig kommune kan legge inn kommentarer til den kommunen
  addStatus_comment: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.token ||
      typeof req.body.comment !== 'string' ||
      typeof req.body.status_id !== 'number' ||
      typeof req.token !== 'string' ||
      isNaN(Number(req.params.case_id))
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);

    let case_status;
    let the_user;
    let create_body;
    let the_case = Case.findOne({
      where: { case_id: Number(req.params.case_id) },
      attributes: ['region_id', 'status_id']
    })
      .then(result => {
        console.log(result);
        case_status = result.dataValues.status_id;
        the_user = User.findOne({ where: { user_id: decoded_token.user_id } });
      })
      .then(() => {
        let region_id_user = the_user.region_id;
        let region_id_case = the_case.region_id;

        if (decoded_token.accesslevel !== 1 && region_id_user !== region_id_case) return res.sendStatus(403);
      })
      .then(() => {
        create_body = {
          comment: req.body.comment,
          case_id: Number(req.params.case_id),
          user_id: decoded_token.user_id
        };
        console.log(req.body.status_id, case_status);
        if (decoded_token.accesslevel <= 2) create_body['status_id'] = req.body.status_id;
        else create_body['status_id'] = case_status;

        console.log(create_body);

        return Status_comment.create(create_body);
      })
      .then(comment => {
        if (comment) {
          if (decoded_token.accesslevel <= 2)
            Case.update({ status_id: req.body.status_id }, { where: { case_id: Number(req.params.case_id) } });
          Case_subscriptions.findAll({ where: { case_id: Number(req.params.case_id), notify_by_email: 1 } }).then(
            async subs => {
              let all_ids = await subs.map(s => {
                return s.user_id;
              });
              let all_users = await User.findAll({ where: { user_id: all_ids } });
              let emails = all_users.map(u => u.email);
              send_subs_email(emails, email_subject, email_body);
              return res.send({ comment: comment });
            }
          );
        }
      })
      .then(() => {
        console.log("Kommer hit");
        Case_subscriptions.update({ is_up_to_date: false }, { where: { case_id: Number(req.params.case_id) } });
      })
      .catch(error => {
        return res.status(500).json(error);
      });
  },
  // Kun den som skrev kommentaren og admin kan endre
  updateStatus_comment: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.token ||
      typeof req.body.comment !== 'string' ||
      typeof req.body.status_id !== 'number' ||
      typeof req.token !== 'string' ||
      isNaN(Number(req.params.status_comment_id)) ||
      isNaN(Number(req.params.case_id))
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;

    let update_body;
    let case_status;

    let status_comment = Status_comment.findOne({
      where: { status_comment_id: Number(req.params.status_comment_id) }
    })
      .then(sc => {
        status_comment = sc.toJSON();
        case_status = status_comment.status_id;
        if (decoded_token.accesslevel !== 1 && user_id_token !== status_comment.user_id) return res.sendStatus(403);
      })
      .then(() => {
        update_body = {
          comment: req.body.comment,
          case_id: Number(req.params.case_id),
          user_id: decoded_token.user_id
        };
        console.log(req.body.status_id, case_status);
        if (decoded_token.accesslevel <= 2) update_body['status_id'] = req.body.status_id;
        else update_body['status_id'] = case_status;

        return Status_comment.update(update_body, {
          where: { status_comment_id: Number(req.params.status_comment_id) }
        }).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
      });
  },
  // Kun den som skrev kommentaren og admin kan slette
  delStatus_comment: function(req: Request, res: Response) {
    if (
      !req.token ||
      typeof req.body.user_id !== 'number' ||
      typeof req.token !== 'string' ||
      isNaN(Number(req.params.status_comment_id)) ||
      isNaN(Number(req.params.case_id))
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = req.body.user_id;

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    return Status_comment.destroy({
      where: { status_comment_id: Number(req.params.status_comment_id) }
    }).then(subscr => (subscr ? res.send() : res.sendStatus(404)));
  }
};
