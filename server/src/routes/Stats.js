// @flow

import { sequelize } from '../models.js';
import { verifyToken } from '../auth';
import { User } from '../models';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getNationalStatsClosed: function(req: Request, res: Response) {
    if (!req.params.year || typeof Number(req.params.year) !== 'number') return res.sendStatus(400);

    sequelize
      .query(
        'SELECT COUNT(case_id) closed_cases, MONTH(updatedAt) month ' +
          'FROM Cases ' +
          'WHERE status_id = 3 ' +
          'AND year(updatedAt) = ? ' +
          'GROUP BY month(updatedAt);',
        {
          replacements: [Number(req.params.year)],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(stats => res.send(stats))
      .catch(err => res.status(500).send(err));
  },
  getNationalStatsOpened: function(req: Request, res: Response) {
    if (!req.params.year || typeof Number(req.params.year) !== 'number') return res.sendStatus(400);

    sequelize
      .query(
        'SELECT COUNT(case_id) opened_cases, MONTH(createdAt) month ' +
          'FROM Cases ' +
          'WHERE year(createdAt) = ? ' +
          'GROUP BY month(createdAt);',
        {
          replacements: [Number(req.params.year)],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(stats => res.send(stats))
      .catch(err => res.status(500).send(err));
  },
  getNationalStatsClosedByRegion: function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.region_id ||
      !req.params.year ||
      typeof Number(req.params.region_id) !== 'number' ||
      typeof Number(req.params.year) !== 'number' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;

    User.findOne({
      where: { user_id: user_id_token }
    }).then(user => {
      if (decoded_token.accesslevel !== 1 && Number(req.params.region_id) !== user.region_id) {
        return res.sendStatus(401);
      } else {
        sequelize
          .query(
            'SELECT COUNT(case_id) closed_cases, MONTH(updatedAt) month ' +
              'FROM Cases ' +
              'WHERE region_id = ? ' +
              'AND status_id = 3 ' +
              'AND year(updatedAt) = ? ' +
              'GROUP BY month(updatedAt);',
            {
              replacements: [Number(req.params.region_id), Number(req.params.year)],
              type: sequelize.QueryTypes.SELECT
            }
          )
          .then(stats => res.send(stats))
          .catch(err => res.status(500).send(err));
      }
    });
  },
  getNationalStatsOpenedByRegion: function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.region_id ||
      !req.params.year ||
      typeof Number(req.params.year) !== 'number' ||
      typeof Number(req.params.region_id) !== 'number' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;

    User.findOne({
      where: { user_id: user_id_token }
    }).then(user => {
      if (decoded_token.accesslevel !== 1 && Number(req.params.region_id) !== user.region_id) {
        return res.sendStatus(401);
      } else {
        sequelize
          .query(
            'SELECT COUNT(case_id) opened_cases, MONTH(createdAt) month ' +
              'FROM Cases ' +
              'WHERE region_id = ? ' +
              'AND year(createdAt) = ? ' +
              'GROUP BY month(createdAt);',
            {
              replacements: [Number(req.params.region_id), Number(req.params.year)],
              type: sequelize.QueryTypes.SELECT
            }
          )
          .then(stats => res.send(stats))
          .catch(err => res.status(500).send(err));
      }
    });
  },
  getNationalStatsCategories: function(req: Request, res: Response) {
    if (!req.params.year || typeof Number(req.params.year) !== 'number') return res.sendStatus(400);

    sequelize
      .query(
        'SELECT COUNT(case_id) count, name category ' +
          'FROM Cases ' +
          'NATURAL JOIN Categories ' +
          'WHERE year(updatedAt) = ? ' +
          'GROUP BY name;',
        {
          replacements: [Number(req.params.year)],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(stats => res.send(stats))
      .catch(err => res.status(500).send(err));
  },
  getStatsCategoriesByRegion: function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.region_id ||
      !req.params.year ||
      typeof Number(req.params.year) !== 'number' ||
      typeof Number(req.params.region_id) !== 'number' ||
      typeof req.token !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;

    User.findOne({
      where: { user_id: user_id_token }
    }).then(user => {
      if (decoded_token.accesslevel !== 1 && Number(req.params.region_id) !== user.region_id) {
        return res.status(401).send();
      } else {
        sequelize
          .query(
            'SELECT COUNT(case_id) count, name category ' +
              'FROM Cases ' +
              'NATURAL JOIN Categories ' +
              'WHERE region_id = ? ' +
              'AND year(updatedAt) = ? ' +
              'GROUP BY name;',
            {
              replacements: [Number(req.params.region_id), Number(req.params.year)],
              type: sequelize.QueryTypes.SELECT
            }
          )
          .then(stats => res.send(stats))
          .catch(err => res.status(500).send(err));
      }
    });
  }
};
