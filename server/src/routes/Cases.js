// @flow

import { Case, User, sequelize } from '../models.js';
import { reqAccessLevel, verifyToken } from '../auth';
import { Case_subscriptions, Picture } from '../models';
import { promisify } from 'util';
import path from 'path';
import { regexNames } from '../utils/Regex';
import { duplicateCheck } from '../utils/DuplicateChecker';
import Epost from '../utils/Epost';
const fs = require('fs');
const unlinkAsync = promisify(fs.unlink);

const public_path = path.join(__dirname, '/../../../client/public');

type Request = express$Request;
type Response = express$Response;

let rawQueryCases =
  'Select c.case_id, c.title, c.description, c.lat, c.lon, c.user_id, ' +
  "CONCAT(u.firstname, ' ', u.lastname) as createdBy, u.tlf, u.email, " +
  'co.county_id, co.name AS county_name, ' +
  'c.region_id, r.name as region_name, ' +
  'c.status_id, s.name as status_name, ' +
  'c.category_id, cg.name as category_name, ' +
  'c.createdAt, c.updatedAt ' +
  'FROM Cases c JOIN Regions r ON c.region_id = r.region_id ' +
  'Join Counties co ON r.county_id = co.county_id ' +
  'JOIN Users u ON c.user_id = u.user_id ' +
  'JOIN Statuses s ON c.status_id = s.status_id ' +
  'JOIN Categories cg ON c.category_id = cg.category_id ';

let rawQueryCasesNoUserInfo =
  'Select c.case_id, c.title, c.description, c.lat, c.lon, c.user_id, ' +
  'co.county_id, co.name AS county_name, ' +
  'c.region_id, r.name as region_name, ' +
  'c.status_id, s.name as status_name, ' +
  'c.category_id, cg.name as category_name, ' +
  'c.createdAt, c.updatedAt ' +
  'FROM Cases c JOIN Regions r ON c.region_id = r.region_id ' +
  'Join Counties co ON r.county_id = co.county_id ' +
  'JOIN Users u ON c.user_id = u.user_id ' +
  'JOIN Statuses s ON c.status_id = s.status_id ' +
  'JOIN Categories cg ON c.category_id = cg.category_id ';

let casesOrder = 'ORDER BY c.updatedAt DESC';

module.exports = {
  /**
   * Get all cases
   * @param req Request
   * @param res Response
   * @returns {Promise<void>}
   */
  getAllCases: async function(req: Request, res: Response) {
    let rawQuery = rawQueryCasesNoUserInfo;
    if (req.token) {
      let decoded_token = verifyToken(req.token);
      let token_access_level = Number(decoded_token.accesslevel);
      if (token_access_level < 4) {
        rawQuery = rawQueryCases;
      }
    }

    let page = 1;
    let limit = 20;

    if (req.query && req.query.page && req.query.limit && Number(req.query.page) > 0 && Number(req.query.limit) > 0) {
      page = Number(req.query.page);
      limit = Number(req.query.limit);
    }
    let offset = (page - 1) * limit;
    sequelize
      .query(rawQuery + casesOrder + ' LIMIT ?,?', {
        replacements: [offset, limit],
        type: sequelize.QueryTypes.SELECT
      })
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
   * Creates a new case
   * @param req Request
   * @param res Response
   * @returns {Promise<Case>}
   */
  createNewCase: async function(req: Request, res: Response) {
    reqAccessLevel(req, res, 4, () => true);
    if (
      !req.body ||
      !req.token ||
      !req.files ||
      typeof req.body.title !== 'string' ||
      typeof req.body.description !== 'string' ||
      typeof Number(req.body.lat) !== 'number' ||
      typeof Number(req.body.lon) !== 'number' ||
      typeof Number(req.body.region_id) !== 'number' ||
      typeof Number(req.body.category_id) !== 'number' ||
      !regexNames.test(req.body.title)
    ) {
      // console.log(req.body);
      return res.status(400).send();
    }

    let duplicate = await duplicateCheck(req.body.lat, req.body.lon, req.body.category_id, req.body.region_id);
    //console.log('Duplicate check: ', duplicate);
    if (duplicate) return res.status(409).send('En lignende sak i nærheten eksisterer allerede');

    let decoded = verifyToken(req.token);
    let user_id = decoded.user_id;

    let filenames = req.files.map(file => {
      return file.filename;
    });

    Case.create({
      title: req.body.title,
      description: req.body.description,
      lat: req.body.lat,
      lon: req.body.lon,
      region_id: req.body.region_id,
      user_id: user_id,
      category_id: req.body.category_id,
      status_id: 1
    })
      .then(newCase => {
        Case_subscriptions.create({
          user_id: user_id,
          case_id: newCase.dataValues.case_id,
          notify_by_email: 1,
          is_up_to_date: 1
        });
        console.log(newCase.dataValues);
        if (req.files.length !== 0) {
          Picture.bulkCreate(
            filenames.map(filename => {
              return {
                path: '/uploads/' + filename,
                alt: 'alternerende text',
                case_id: newCase.dataValues.case_id
              };
            })
          )
            .then(res.send(newCase))
            .catch(error => {
              return res.status(400).send(error);
            });
        } else {
          return res.send(newCase);
        }
      })
      .then(async () => {
        let user = await User.findOne({ where: { user_id: user_id }, attributes: ['email'] });
        Epost.send_email(
          user.email,
          'Ny sak opprettet',
          `Saken din "${
            req.body.title
          }" ble opprettet. Du kan følge med på saken din på nettsida. \n\nMvh. Hverdagshelt Team 6`
        );
      })
      .catch(error => {
        return res.status(500).send(error);
      });
  },
  /**
   * Gets one case, for given case_id
   * @param req Request
   * @param res Response
   * @returns {Promise<Response>}
   */
  getOneCase: async function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.case_id))) return res.sendStatus(400);

    let rawQuery = rawQueryCasesNoUserInfo;
    if (req.token) {
      let decoded_token = verifyToken(req.token);
      let token_access_level = Number(decoded_token.accesslevel);
      if (token_access_level < 4) {
        rawQuery = rawQueryCases;
      }
    }

    sequelize
      .query(rawQuery + ' WHERE c.case_id = ?;', {
        replacements: [req.params.case_id],
        type: sequelize.QueryTypes.SELECT
      })
      .then(async result => {
        let pictures = await Picture.findAll({ where: { case_id: req.params.case_id } });
        result[0].img = pictures.map(img => img.path);
        return result ? res.send(result) : res.sendStatus(404);
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  },
  /**
   * Updates one case
   * @param req Request
   * @param res Response
   * @returns {Case}
   */
  updateCase: function(req: Request, res: Response) {
    if (
      !req.body ||
      !req.token ||
      !req.params ||
      isNaN(Number(req.params.case_id)) ||
      typeof req.body.title !== 'string' ||
      typeof req.body.description !== 'string' ||
      typeof Number(req.body.lat) !== 'number' ||
      typeof Number(req.body.lon) !== 'number' ||
      typeof Number(req.body.reqion_id) !== 'number' ||
      typeof Number(req.body.category_id) !== 'number' ||
      typeof Number(req.body.status_id) !== 'number' ||
      !regexNames.test(req.body.title)
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let token_user_id = Number(decoded_token.user_id);
    let token_access_level = Number(decoded_token.accesslevel);
    if (Number(token_access_level) !== 1) delete req.body.status_id;

    return Case.findOne({ where: { case_id: Number(req.params.case_id) } })
      .then(cases => {
        if (!cases) throw new TypeError('Case not found.');
        if (cases.user_id !== token_user_id && token_access_level > 2) {
          return res.status(401).send({ message: 'User not allowed to update case.' });
        }
        Case.update(req.body, { where: { case_id: Number(req.params.case_id) } })
          .then(newCase => {
            return res.send(newCase);
          })
          .catch(error => {
            return res.status(500).send(error.message);
          });
      })
      .catch(error => {
        if (error instanceof TypeError) return res.status(404).send(error.message);
        else return res.status(500).send(error.message);
      });
  },
  /**
   * Deletes one case
   * @param req Request
   * @param res Response
   * @returns {Promise<*>}
   */
  deleteCase: async function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params ||
      !req.params.case_id ||
      isNaN(Number(req.params.case_id)) ||
      typeof req.token != 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let token_user_id = Number(decoded_token.user_id);
    let token_access_level = Number(decoded_token.accesslevel);
    let params_case_id = Number(req.params.case_id);

    if (token_access_level > 2) {
      return Case.findOne({ where: { case_id: params_case_id } }).then(async cases => {
        if (!cases) {
          console.log(cases);
          return res.status(404).send({ msg: 'Case not found.' });
        }
        if (Number(cases.user_id) !== token_user_id) return res.status(401).send({ msg: 'User is unauthorized.' });

        let pictures = await Picture.findAll({ where: { case_id: params_case_id } });
        let path_array = await pictures.map(p => {
          return p.path;
        });

        Case.destroy({ where: { case_id: params_case_id } })
          .then(async result => {
            console.log(result);
            await path_array.forEach(p => {
              unlinkAsync(public_path + p);
            });
            return res.status(200).send({ msg: 'Case deleted.' });
          })
          .catch(error => {
            return res.status(500).send(error);
          });
      });
    }
    let pictures = await Picture.findAll({ where: { case_id: params_case_id } });
    let path_array = await pictures.map(p => {
      return p.path;
    });

    Case.destroy({ where: { case_id: params_case_id } })
      .then(async result => {
        if (result === 0) {
          return res.sendStatus(404);
        }
        await path_array.forEach(p => {
          unlinkAsync(public_path + p);
        });
        return res.status(200).send({ msg: 'Case deleted.' });
      })
      .catch(error => {
        return res.status(500).send(error);
      });
  },
  /**
   * Gets all cases with given region name
   * @param req Request
   * @param res Response
   * @returns {Case}
   */
  getAllCasesInRegionByName: function(req: Request, res: Response) {
    if (
      !req.params ||
      !req.params.county_name ||
      !req.params.region_name ||
      typeof req.params.county_name != 'string' ||
      typeof req.params.region_name != 'string'
    )
      return res.sendStatus(400);

    let rawQuery = rawQueryCasesNoUserInfo;
    if (req.token) {
      let decoded_token = verifyToken(req.token);
      let token_access_level = Number(decoded_token.accesslevel);
      if (token_access_level < 4) {
        rawQuery = rawQueryCases;
      }
    }

    let county_check = { 'Sør-Trøndelag': 'Trøndelag', 'Nord-Trøndelag': 'Trøndelag' };
    let county_name = req.params.county_name;
    if (req.params.county_name in county_check) county_name = county_check[req.params.county_name];

    let page = 1;
    let limit = 20;

    if (req.query && req.query.page && req.query.limit && Number(req.query.page) > 0 && Number(req.query.limit) > 0) {
      page = Number(req.query.page);
      limit = Number(req.query.limit);
    }
    let start_limit = (page - 1) * limit;

    return sequelize
      .query(rawQuery + ' WHERE r.name = ? AND co.name = ? ' + casesOrder + ' Limit ?,?', {
        replacements: [req.params.region_name, county_name, start_limit, limit],
        type: sequelize.QueryTypes.SELECT
      })
      .then(async cases => {
        console.log(cases);
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
   * Gets all cases with given region_id
   * @param req Request
   * @param res Response
   * @returns {Promise<Response>}
   */
  getAllCasesInRegionById: async function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.region_id))) return res.sendStatus(400);

    let rawQuery = rawQueryCasesNoUserInfo;
    if (req.token) {
      let decoded_token = verifyToken(req.token);
      let token_access_level = Number(decoded_token.accesslevel);
      if (token_access_level < 4) {
        rawQuery = rawQueryCases;
      }
    }

    let page = 1;
    let limit = 20;

    if (req.query && req.query.page && req.query.limit && Number(req.query.page) > 0 && Number(req.query.limit) > 0) {
      page = Number(req.query.page);
      limit = Number(req.query.limit);
    }
    let offset = (page - 1) * limit;

    sequelize
      .query(rawQuery + ' WHERE c.region_id = ? ' + casesOrder + ' LIMIT ?,?', {
        replacements: [Number(req.params.region_id), offset, limit],
        type: sequelize.QueryTypes.SELECT
      })
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
   * Gets all cases belonging to given user_id
   * @param req Request
   * @param res Response
   * @returns {Promise<Response>}
   */
  getAllCasesForUser: async function(req: Request, res: Response) {
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
    let offset = (page - 1) * limit;

    sequelize
      .query(rawQueryCases + ' WHERE c.user_id = ? ' + casesOrder + ' LIMIT ?,?', {
        replacements: [Number(req.params.user_id), offset, limit],
        type: sequelize.QueryTypes.SELECT
      })
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
   * Get all cases that matches searchstring on title, description, category, county or region
   * @param req Request
   * @param res Response
   * @returns Case
   */
  search: function(req: Request, res: Response) {
    let search = '%' + req.params.searchtext + '%';

    let page = 1;
    let limit = 20;

    if (req.query && req.query.page && req.query.limit && Number(req.query.page) > 0 && Number(req.query.limit) > 0) {
      page = Number(req.query.page);
      limit = Number(req.query.limit);
    }
    let start_limit = (page - 1) * limit;

    sequelize
      .query(
        rawQueryCases +
          'WHERE title LIKE ? ' +
          'OR description LIKE ? ' +
          'OR co.name LIKE ? ' +
          'OR r.name LIKE ? ' +
          'OR cg.name LIKE ? ' +
          casesOrder +
          ' LIMIT ?,?;',
        {
          replacements: [search, search, search, search, search, start_limit, limit],
          type: sequelize.QueryTypes.SELECT
        }
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
