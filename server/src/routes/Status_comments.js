// @flow

import { Case, Status_comment, User, sequelize } from '../models';
import { verifyToken } from '../auth';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllStatus_comment: async function(req: Request, res: Response) {
    sequelize
      .query(
        'Select sc.status_comment_id, sc.comment, sc.createdAt, sc.updatedAt, sc.case_id, sc.status_id, sc.user_id, ' +
          "CONCAT(u.firstname, ' ', u.lastname) as createdBy, " +
          's.name AS status_name ' +
          'FROM Status_comments sc ' +
          'JOIN Users u ON sc.user_id = u.user_id ' +
          'JOIN Statuses s ON sc.status_id = s.status_id ' +
          'WHERE case_id = ?;',
        {
          replacements: [Number(req.params.case_id)],
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
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);

    let the_user;
    let the_case = Case.findOne({ where: { case_id: Number(req.params.case_id) } })
      .then(() => {
        the_user = User.findOne({ where: { user_id: decoded_token.user_id } });
      })
      .then(() => {
        let region_id_user = the_user.region_id;
        let region_id_case = the_case.region_id;

        if (decoded_token.accesslevel !== 1 && region_id_user !== region_id_case) return res.sendStatus(403);
      })
      .then(() => {
        return Status_comment.create({
          comment: req.body.comment,
          case_id: Number(req.params.case_id),
          status_id: req.body.status_id,
          user_id: decoded_token.user_id
        });
      })
      .then(comment => (comment ? res.send(comment) : res.sendStatus(404)));
  },
  // Kun den som skrev kommentaren og admin kan endre
  updateStatus_comment: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.token ||
      typeof req.body.comment !== 'string' ||
      typeof req.body.status_id !== 'number' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;

    let status_comment = Status_comment.findOne({
      where: { status_comment_id: Number(req.params.status_comment_id) }
    })
      .then(sc => {
        status_comment = sc.toJSON();
        if (decoded_token.accesslevel !== 1 && user_id_token !== status_comment.user_id) return res.sendStatus(403);
      })
      .then(() => {
        return Status_comment.update(
          {
            comment: req.body.comment,
            case_id: Number(req.params.case_id),
            status_id: req.body.status_id,
            user_id: user_id_token
          },
          {
            where: { status_comment_id: Number(req.params.status_comment_id) }
          }
        ).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
      });
  },
  // Kun den som skrev kommentaren og admin kan slette
  delStatus_comment: function(req: Request, res: Response) {
    if (!req.token || typeof req.body.user_id !== 'number' || typeof req.token !== 'string') return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = req.body.user_id;

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    return Status_comment.destroy({
      where: { status_comment_id: Number(req.params.status_comment_id) }
    }).then(subscr => (subscr ? res.send(subscr) : res.sendStatus(404)));
  }
};
