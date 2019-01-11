// @flow

import { User } from '../models.js';
import { createToken, hashPassword, loginOk, verifyToken } from '../auth';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllUsers: function(req: Request, res: Response) {
    return User.findAll().then(users => res.send(users));
  },

  createUser: function(req: Request, res: Response) {
    if (
      !req.body ||
      typeof req.body.firstname !== 'string' ||
      typeof req.body.lastname !== 'string' ||
      typeof req.body.tlf !== 'number' ||
      typeof req.body.email !== 'string' ||
      typeof req.body.password !== 'string' ||
      typeof req.body.region_id !== 'number'
    )
      return res.sendStatus(400);

    let hashedPassword = hashPassword(req.body.password);
    let password = hashedPassword['passwordHash'];
    let salt = hashedPassword['salt'];

    return User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      tlf: req.body.tlf,
      email: req.body.email,
      hashed_password: password,
      salt: salt,
      role_id: 4,
      region_id: req.body.region_id
    }).then(users => (users ? res.send(users) : res.sendStatus(404)));
  },

  getOneUser: function(req: Request, res: Response) {
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

    return User.findOne({ where: { user_id: user_id_param } }).then(user =>
      user ? res.send(user) : res.sendStatus(404)
    );
  },

  updateOneUser: function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.user_id ||
      !req.body ||
      typeof Number(req.params.user_id) !== 'number' ||
      typeof req.token !== 'string' ||
      typeof req.body.firstname !== 'string' ||
      typeof req.body.lastname !== 'string' ||
      typeof req.body.tlf !== 'number' ||
      typeof req.body.email !== 'string' ||
      typeof req.body.region_id !== 'number'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    return User.update(
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        tlf: req.body.tlf,
        email: req.body.email,
        region_id: req.body.region_id
      },
      { where: { user_id: req.params.user_id } }
    ).then(users => (users ? res.send(users) : res.sendStatus(404)));
  },

  deleteOneUser: function(req: Request, res: Response) {
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

    return User.destroy({ where: { user_id: Number(req.params.user_id) } }).then(
        user => (user ? res.send() : res.status(400).send())
    );
  }
};
