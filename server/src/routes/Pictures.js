// @flow

import crypto from 'crypto';
import path from 'path';
import { Picture, Case } from '../models.js';
import { verifyToken } from '../auth.js';

const public_path = path.join(__dirname, '/../../../client/public');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: public_path + '/' + 'uploads',
  filename: function(req, file, callback) {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      console.log('crypto firing!!!');
      if (err) return callback(err);
      console.log(file.originalname);
      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});
const upload = multer({ storage: storage });

type Request = express$Request;
type Response = express$Response;

module.exports = {
  uploadPicture: function(req: Request, res: Response) {
    if (!req.params || typeof Number(req.params.case_id) != 'number')
      return res.status(400).send({ err: 'Invalid or missing CaseID in URL-parameter.' });
    let decoded_token = verifyToken(req.token);
    let token_user_id = Number(decoded_token.user_id);
    let token_access_level = Number(decoded_token.accesslevel);
    let param_case_id = Number(req.params.case_id);

    Case.findOne({ where: { case_id: param_case_id } })
      .then(async (cases) => {
        if (!cases) return res.sendStatus(404);
        if (cases.user_id !== token_user_id && token_access_level > 2) return res.sendStatus(401);
        let count_pictures = Picture.count({ where: { case_id: param_case_id }});
        if(await count_pictures >= 3) {
          return res.status(507).send({err: "Maximum number of pictures already reached for this case."})
        }
        else {
          upload.single('image')(req, {}, function(err) {
            if(err) throw err;
            if (!req.file) return res.status(400).send({ err: 'No image file received.' });
            let filename = req.file.filename;
            if (!filename) throw new multer.MulterError();
            Picture.create({
              path: '/uploads/' + filename,
              alt: 'alternerende tekst',
              case_id: param_case_id
            })
              .then(result => {
                return res.sendStatus(200);
              })
              .catch(error => {
                return res.status(500).send(error.mesage);
              });
          });
        }
      })
      .catch(error => {
        return res.status(500).send(error.message);
      });
  }
};
