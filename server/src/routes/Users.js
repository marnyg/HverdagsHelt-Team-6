// @flow

import { User } from '../models.js';
import { createToken, hashPassword, loginOk, verifyToken } from '../auth';
import { Region_subscriptions, sequelize } from '../models';
import Epost from './../utils/Epost.js'

type Request = express$Request;
type Response = express$Response;

const email_subject = "Bruker opprettet - Hverdagshelt";

module.exports = {
  getAllUsers: function(req: Request, res: Response) {
    return User.findAll({ attributes: ['user_id', 'firstname', 'lastname', 'email', 'tlf', 'region_id'] }).then(users =>
      res.send(users)
    );
  },

  createUser: async function(req: Request, res: Response) {
    let regexNames = /^[a-zA-ZæøåÆØÅ\-\s]+$/;
    let regexNumber = /^[\d]{8}$/;
    let regexEmail = /^[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)*@[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)+$/;
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    let regexRegionId = /^[\d]+$/;
    console.log('NAMES:');
    console.log('true: ', regexNames.test('Magne'));
    console.log('true: ', regexNames.test('ÆØÅæøå'));
    console.log('true: ', regexNames.test('Æ-df'));
    console.log('true: ', regexNames.test('ÆØÅ æøå'));
    console.log('false: ', regexNames.test('.,!"#¤%%&¤@£$€{{[]]]{€'));
    console.log('NUMBER:');
    console.log('false: ', regexNumber.test('.,!"#¤%%&¤@£$€{{[]]]{€'));
    console.log('false: ', regexNumber.test(' 123234 '));
    console.log('true: ', regexNumber.test('12345678'));
    console.log('false: ', regexNumber.test('113'));
    console.log('false: ', regexNumber.test('12345678910'));
    console.log('EMAIL:');
    console.log('true: ', regexEmail.test('olaæøå.nord.mann@stud.ntnu.no'));
    // 8 tegn
    // Stor og liten bokstav, og tall
    console.log('PASSWORD:');
    console.log('false: ', regexPassword.test('12345678'));
    console.log('false: ', regexPassword.test('1234567a'));
    console.log('true: ', regexPassword.test('123456aB'));
    console.log('REGION_ID:');
    console.log('true: ', regexRegionId.test('1'));
    console.log('false: ', regexRegionId.test(' 2334 '));
    console.log('false: ', regexRegionId.test('en'));
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

    return await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      tlf: req.body.tlf,
      email: req.body.email,
      hashed_password: password,
      salt: salt,
      role_id: 4,
      region_id: req.body.region_id
    }).then(async users => {
      let body = `Epost-adressen ${users.email} har blitt brukt for å opprette en bruker på systemet til hverdagshelt\n` +
      `Vennligst ta kontakt med vår support på support.hverdagshelt.team6@gmail.com hvis dette ikke var deg.`;

      let email_info = await Epost.send_email(users.email, email_subject, body);
      console.log(email_info);
      if(email_info) res.send({
        user_id: users.user_id,
        msg: "Bruker opprettet, og epost sendt."
      });
      res.send({
        user_id: users.user_id,
        msg: "Bruker opprettet, men epost kunne ikke bli sendt."
      });
    })
      .catch(err => {
        err.description = 'Det finnes allerede en bruker med den oppgitte e-posten, bruk en unik e-post';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
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

    return User.findOne({
      where: { user_id: user_id_param },
      attributes: ['user_id', 'firstname', 'lastname', 'email', 'tlf', 'region_id']
    }).then(user => (user ? res.send(user) : res.sendStatus(404)));
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
    )
      .then(users => (users ? res.send(users) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede en bruker med den oppgitte eposten, bruk en unik epost';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
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

    return User.destroy({ where: { user_id: Number(req.params.user_id) } })
      .then(user => (user ? res.send() : res.status(400).send()))
      .catch(() => {
        User.update(
          {
            firstname: 'Bruker',
            lastname: 'Slettet',
            tlf: 0,
            email: '',
            hashed_password: '',
            salt: '',
            role_id: 5
          },
          { where: { user_id: Number(req.params.user_id) } }
        ).then(() => {
          res.status(200).send();
          console.log('Sensitive user data wiped');
        });
      });
  },
  changePassword: async function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.user_id ||
      !req.body ||
      typeof Number(req.params.user_id) !== 'number' ||
      typeof req.token !== 'string' ||
      typeof req.body.old_password !== 'string' ||
      typeof req.body.new_password !== 'string'
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    let user = await User.findOne({
      where: { user_id: Number(req.params.user_id) }
    });

    let salt = user.salt;
    let old = user.hashed_password;

    let oldHashedPassword = hashPassword(req.body.old_password, salt);
    let old_password = oldHashedPassword['passwordHash'];

    if (old_password === old) {
      let newHashedPassword = hashPassword(req.body.new_password);
      let new_password = newHashedPassword['passwordHash'];
      let new_salt = newHashedPassword['salt'];

      return User.update(
        {
          hashed_password: new_password,
          salt: new_salt
        },
        { where: { user_id: Number(req.params.user_id) } }
      ).then(count => (count ? res.send(count) : res.sendStatus(404)));
    } else {
      return res.sendStatus(403);
    }
  },
  getRegionSubscriptionsForUser: function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.user_id ||
      typeof Number(req.params.user_id) !== 'number' ||
      typeof req.token !== 'string'
    ) {
      return res.sendStatus(400);
    }

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(403);

    const subscr = { user_id: Number(req.params.user_id) };
    sequelize
      .query(
        'Select sub.region_id, r.name as region_name, sub.notify ' +
          'FROM Region_subscriptions sub JOIN Regions r ON sub.region_id = r.region_id ' +
          'WHERE sub.user_id = ?;',
        {
          replacements: [Number(req.params.user_id)],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(subs => {
        subscr.regions = subs;
        return res.send(subscr);
      })
      .catch(err => res.status(500).send(err));
  }
};
