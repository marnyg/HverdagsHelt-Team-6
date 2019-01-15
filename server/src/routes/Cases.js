// @flow

import { Case, sequelize } from '../models.js';
import { reqAccessLevel, verifyToken } from '../auth';
import { Picture } from '../models';

module.exports = {
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
        'Select c.case_id, c.title, c.description, c.lat, c.lon, r.name as region_name, s.name as status_name, ' +
          "CONCAT(u.firstname, ' ', u.lastname) as createdBy, c.createdAt, c.updatedAt " +
          'FROM Cases c JOIN Regions r ON c.region_id = r.region_id ' +
          'JOIN Users u ON c.user_id = u.user_id ' +
          'JOIN Statuses s ON c.status_id = s.status_id ' +
          'WHERE c.case_id = ?;',
        { replacements: [req.params.case_id] },
        { type: sequelize.QueryTypes.SELECT }
      )
      .then( async (result) => {
        let pictures = Picture.findAll({ where: { case_id: req.params.case_id } });
        let images = await pictures.map(img => img.path);
        let data = result[0][0];
        data['images'] = images;
        return res.send(data);
      })
  }
};
