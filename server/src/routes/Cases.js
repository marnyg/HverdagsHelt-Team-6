// @flow

import { Case, sequelize } from '../models.js';
import { reqAccessLevel, verifyToken } from '../auth';
import { Picture } from '../models';

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
  'JOIN Categories cg ON c.category_id = cg.category_id ' +
  'ORDER BY c.updatedAt DESC';

module.exports = {
  getAllCases: async function(req: Request, res: Response) {
    sequelize
      .query(rawQueryCases, { type: sequelize.QueryTypes.SELECT })
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

  createNewCase: function(req: Request, res: Response) {
    reqAccessLevel(req, res, 4, () => true);
    console.log('11111111111111111111111111 DENNE SKAL VI SE');
    if (req.body) {
      console.log(req.body);
      console.log(req.body.images);
    }
    if (!req.files) {
      console.log('No file received');
      return res.send({
        success: false
      });
    } else {
      console.log('files received');
      let filenames = req.files.map(file => {
        return file.filename;
      });
      console.log(filenames);

      if (
        !req.body ||
        !req.token ||
        typeof req.body.title !== 'string' ||
        typeof req.body.description !== 'string' ||
        typeof Number(req.body.lat) != 'number' ||
        typeof Number(req.body.lon) != 'number' ||
        typeof Number(req.body.region_id) != 'number' ||
        typeof Number(req.body.category_id) != 'number'
      ) {
        console.log(req.body);
        return res.sendStatus(400);
      }

      let decoded = verifyToken(req.token);
      let user_id = decoded.user_id;

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
          console.log(newCase.dataValues);
          if (req.files.length !== 0)
            Picture.bulkCreate(
              filenames.map(filename => {
                return {
                  path: '/uploads/' + filename,
                  alt: 'alternerende text',
                  case_id: newCase.dataValues.case_id
                };
              })
            )
              .then(res.sendStatus(200))
              .catch(error => {
                return res.status(400).send(error);
              });
        })
        .catch(error => {
          return res.status(500).send(error);
        });
    }
  },

  getOneCase: async function(req: Request, res: Response) {
    if (!req.params || typeof Number(req.params.case_id) != 'number') return res.sendStatus(400);
    /*
    sequelize.query("Select case_id, title, description, c.lat as case_lat, c.lon as case_lon, r.name as region_name, CONCAT(u.firstname, ' ', u.lastname) as created_by, createdAt, updatedAt from Cases c natural join Regions r natural join Users u where c.case_id = ?",
      { replacements: [req.params.case_id] },
      { type: sequelize.QueryTypes.SELECT }).then(result => {
        console.log(result);
        return res.send(result);
    })
    */
    sequelize
      .query(rawQueryCases + ' WHERE c.case_id = ?;', {
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
  getAllCasesInRegionByName: async function(req: Request, res: Response) {
    if (!req.params || typeof req.params.county_name != 'string' || typeof req.params.region_name != 'string')
      return res.sendStatus(400);

    return sequelize
      .query(rawQueryCases + ' WHERE r.name = ? AND co.name = ?;', {
        replacements: [req.params.region_name, req.params.county_name],
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
  getAllCasesInRegionById: async function(req: Request, res: Response) {
    if (!req.params || typeof Number(req.params.region_id) != 'number') return res.sendStatus(400);
    sequelize
      .query(rawQueryCases + ' WHERE c.region_id = ?;', {
        replacements: [Number(req.params.region_id)],
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
  getAllCasesForUser: async function(req: Request, res: Response) {
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

    sequelize
      .query(rawQueryCases + ' WHERE c.user_id = ?;', {
        replacements: [Number(req.params.user_id)],
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
  }
};
