// @flow

import { Case, sequelize } from '../models.js';
import { reqAccessLevel, verifyToken } from '../auth';
import { Category, Picture, Status, Region } from '../models';
import Regions from './Regions';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllCases: async function(req: Request, res: Response) {
    sequelize
      .query(
        'Select c.case_id, c.title, c.description, c.lat, c.lon, r.name as region_name, s.name as status_name, cg.name as category_name, ' +
          "CONCAT(u.firstname, ' ', u.lastname) as createdBy, c.createdAt, c.updatedAt " +
          'FROM Cases c JOIN Regions r ON c.region_id = r.region_id ' +
          'JOIN Users u ON c.user_id = u.user_id ' +
          'JOIN Statuses s ON c.status_id = s.status_id ' +
          'JOIN Categories cg ON c.category_id = cg.category_id',
        { type: sequelize.QueryTypes.SELECT }
      )
      .then(async cases => {
        const out = cases.map(async c => {
          let pictures = await Picture.findAll({ where: { case_id: c.case_id }, attributes: ['path'] });
          let images = await pictures.map(img => img.path);
          c.img = images;
          return c;
        });
        return Promise.all(out).then(cases => (cases ? res.send(cases) : res.sendStatus(404)));
      });
  },

  createNewCase: function(req: Request, res: Response) {
    reqAccessLevel(req, res, 4, () => true);
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
        typeof Number(req.body.lat) !== 'number' ||
        typeof Number(req.body.lon) !== 'number' ||
        typeof Number(req.body.region_id) !== 'number' ||
        typeof Number(req.body.user_id) !== 'number' ||
        typeof Number(req.body.category_id) !== 'number' ||
        typeof Number(req.body.status_id) !== 'number'
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
          return res.status(400).send(error);
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
      .query(
        'Select c.case_id, ca.name AS category_name, c.title, c.description, c.lat, c.lon, r.name as region_name, s.name as status_name, ' +
          "CONCAT(u.firstname, ' ', u.lastname) as createdBy, c.createdAt, c.updatedAt " +
          'FROM Cases c JOIN Regions r ON c.region_id = r.region_id ' +
          'JOIN Users u ON c.user_id = u.user_id ' +
          'JOIN Statuses s ON c.status_id = s.status_id ' +
          'JOIN Categories ca ON c.category_id = ca.category_id ' +
          'WHERE c.case_id = ?;',
        { replacements: [req.params.case_id] },
        { type: sequelize.QueryTypes.SELECT }
      )
      .then(async result => {
        let pictures = Picture.findAll({ where: { case_id: req.params.case_id } });
        let images = await pictures.map(img => img.path);
        let data = result[0][0];
        data['images'] = images;
        return res.send(data);
      });
  },
  getAllCasesInRegion: async function(req: Request, res: Response) {
    let region = await Regions.getOneRegionByNameAndCounty(req, res);
    let regionId = region ? region : res.sendStatus(404);
    let cases = await Case.findAll({
      where: { region_id: Number(regionId.region_id) },
      order: [['updatedAt', 'DESC']]
    });
    cases = cases.map(c => c.toJSON());
    const out = cases.map(async c => {
      let stat_name = await Status.findOne({ where: { status_id: c.status_id }, attributes: ['name'] });
      let cat_name = await Category.findOne({ where: { category_id: c.category_id }, attributes: ['name'] });
      let pics = await Picture.findAll({ where: { case_id: c.case_id }, attributes: ['path'] });
      delete c.status_id;
      delete c.category_id;
      c.region_name = req.params.region_name;
      c.status_name = stat_name.name;
      c.category_name = cat_name.name;
      c.img = pics.map(img => img.path);
      return c;
    });
    return Promise.all(out).then(cases => (cases ? res.send(cases) : res.sendStatus(404)));
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

    let cases = await Case.findAll({
      where: { user_id: req.params.user_id },
      order: [['updatedAt', 'DESC']]
    }).then(cases => (cases ? cases : res.sendStatus(404)));
    cases = cases.map(c => c.toJSON());
    const out = cases.map(async c => {
      let reg_name = await Region.findOne({ where: { region_id: c.region_id }, attributes: ['name'] });
      let stat_name = await Status.findOne({ where: { status_id: c.status_id }, attributes: ['name'] });
      let cat_name = await Category.findOne({ where: { category_id: c.category_id }, attributes: ['name'] });
      let pics = await Picture.findAll({ where: { case_id: c.case_id }, attributes: ['path'] });
      delete c.status_id;
      delete c.category_id;
      c.region_name = reg_name.name;
      c.status_name = stat_name.name;
      c.category_name = cat_name.name;
      c.img = pics.map(img => img.path);
      return c;
    });
    return Promise.all(out).then(cases => (cases ? res.send(cases) : res.sendStatus(404)));
  }
};
