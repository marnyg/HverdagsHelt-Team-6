// @flow

import { User } from '../models.js';
import { remove_token, hashPassword, loginOk, verifyToken } from '../auth';
import { Region_subscriptions, sequelize } from '../models';
import { regexNames, regexNumber, regexEmail, regexPassword, regexRegionId } from './../utils/Regex.js';
import Epost from './../utils/Epost.js';

type Request = express$Request;
type Response = express$Response;

const email_subject = 'Bruker opprettet - Hverdagshelt';

module.exports = {
  /**
   * Get all users
   * @param req Request
   * @param res Response
   * @returns {User}
   */
  getAllUsers: function(req: Request, res: Response) {
    if (!req.token) return res.sendStatus(400);
    let sql_query =
      'Select u.user_id, u.firstname, u.lastname, ' +
      'u.email, u.tlf, u.region_id, u.role_id, r.name, r.access_level ' +
      'from Users u JOIN Roles r ON u.role_id = r.role_id';

    return sequelize
      .query(sql_query, {
        type: sequelize.QueryTypes.SELECT
      })
      .then(users => {
        return res.send(users);
      })
      .catch(error => {
        return res.status(500).json(error);
      });
  },
  /**
   * Add a new user
   * @param req Request
   * @param res Response
   * @returns {Promise<JSON>}
   */
  createUser: async function(req: Request, res: Response) {
    if (
      !req.body ||
      typeof req.body.firstname !== 'string' ||
      typeof req.body.lastname !== 'string' ||
      typeof req.body.tlf !== 'number' ||
      typeof req.body.email !== 'string' ||
      typeof req.body.password !== 'string' ||
      typeof req.body.region_id !== 'number' ||
      typeof req.body.role_id !== 'number' ||
      !regexNames.test(req.body.firstname) ||
      !regexNames.test(req.body.lastname) ||
      !regexNumber.test(req.body.tlf) ||
      !regexEmail.test(req.body.email) ||
      !regexPassword.test(req.body.password) ||
      !regexRegionId.test(req.body.region_id)
    )
      return res.sendStatus(400);

    let hashedPassword = hashPassword(req.body.password);
    let password = hashedPassword['passwordHash'];
    let salt = hashedPassword['salt'];
    let update_user_obj = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      tlf: req.body.tlf,
      email: req.body.email,
      hashed_password: password,
      salt: salt,
      role_id: 4,
      region_id: req.body.region_id
    };

    if (req.token && Number(verifyToken(req.token).accesslevel) === 1)
      update_user_obj['role_id'] = Number(req.body.role_id);

    return await User.create(update_user_obj)
      .then(async users => {
        let body =
          `Epost-adressen ${users.email} har blitt brukt for å opprette en bruker på systemet til hverdagshelt\n` +
          `Vennligst ta kontakt med vår support på support.hverdagshelt.team6@gmail.com hvis dette ikke var deg.`;

        let email_info = await Epost.send_email(users.email, email_subject, body);
        console.log(email_info);
        if (email_info) {
          res.send({
            user_id: users.user_id,
            msg: 'Bruker opprettet, og epost sendt.'
          });
        } else {
          res.send({
            user_id: users.user_id,
            msg: 'Bruker opprettet, men epost kunne ikke bli sendt.'
          });
        }
      })
      .catch(err => {
        err.description = 'Det finnes allerede en bruker med den oppgitte e-posten, bruk en unik e-post';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  /**
   * Get one user with given user_id
   * @param req Request
   * @param res Response
   * @returns {User}
   */
  getOneUser: function(req: Request, res: Response) {
    if (!req.token || !req.params.user_id || isNaN(Number(req.params.user_id)) || typeof req.token !== 'string')
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

    return User.findOne({
      where: { user_id: user_id_param },
      attributes: ['user_id', 'firstname', 'lastname', 'email', 'tlf', 'region_id']
    }).then(user => (user ? res.send(user) : res.sendStatus(404)));
  },
  /**
   * Update a user
   * @param req Request
   * @param res Response
   * @returns {JSON}
   */
  updateOneUser: function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.user_id ||
      !req.body ||
      isNaN(Number(req.params.user_id)) ||
      typeof req.token !== 'string' ||
      typeof req.body.firstname !== 'string' ||
      typeof req.body.lastname !== 'string' ||
      typeof req.body.tlf !== 'number' ||
      typeof req.body.email !== 'string' ||
      typeof req.body.region_id !== 'number' ||
      typeof req.body.role_id !== 'number' ||
      !regexNames.test(req.body.firstname) ||
      !regexNames.test(req.body.lastname) ||
      !regexNumber.test(req.body.tlf) ||
      !regexEmail.test(req.body.email) ||
      !regexRegionId.test(req.body.region_id)
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

    let user_update_obj = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      tlf: req.body.tlf,
      email: req.body.email,
      region_id: req.body.region_id
    };
    if (decoded_token.accesslevel === 1) {
      user_update_obj['role_id'] = Number(req.body.role_id);
    }

    return User.update(user_update_obj, { where: { user_id: req.params.user_id } })
      .then(users => {
        if (!users) return res.sendStatus(404);
        if (users[0] === 1) {
          return res.send({ msg: 'User successfully updated' });
        }
        return res.sendStatus(200);
      })
      .catch(err => {
        err.description = 'Det finnes allerede en bruker med den oppgitte eposten, bruk en unik epost';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  /**
   * Delete a user
   * @param req Request
   * @param res Response
   * @returns {*}
   */
  deleteOneUser: function(req: Request, res: Response) {
    if (!req.token || !req.params.user_id || isNaN(Number(req.params.user_id)) || typeof req.token !== 'string')
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

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
  /**
   * Change passoword for a user
   * @param req Request
   * @param res Response
   * @returns {Promise<*>}
   */
  changePassword: async function(req: Request, res: Response) {
    if (
      !req.token ||
      !req.params.user_id ||
      !req.body ||
      isNaN(Number(req.params.user_id)) ||
      typeof req.token !== 'string' ||
      typeof req.body.old_password !== 'string' ||
      typeof req.body.new_password !== 'string' ||
      !regexPassword.test(req.body.new_password)
    )
      return res.sendStatus(400);

    let decoded_token = verifyToken(req.token);
    let user_id_token = decoded_token.user_id;
    let user_id_param = Number(req.params.user_id);

    if (decoded_token.accesslevel !== 1 && user_id_token !== user_id_param) return res.sendStatus(401);

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
      return res.sendStatus(401);
    }
  },
  /**
   * Get all region subscriptions for a user
   * @param req Request
   * @param res Response
   * @returns {Region}
   */
  getRegionSubscriptionsForUser: function(req: Request, res: Response) {
    if (!req.token || !req.params.user_id || isNaN(Number(req.params.user_id)) || typeof req.token !== 'string') {
      return res.sendStatus(400);
    }

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
    let start_limit = (page - 1) * limit;

    const subscr = { user_id: Number(req.params.user_id) };
    sequelize
      .query(
        'Select sub.region_id, r.name as region_name, sub.notify ' +
          'FROM Region_subscriptions sub JOIN Regions r ON sub.region_id = r.region_id ' +
          'WHERE sub.user_id = ? LIMIT ?,?;',
        {
          replacements: [Number(req.params.user_id), start_limit, limit],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(subs => {
        subscr.regions = subs;
        return res.send(subscr);
      })
      .catch(err => res.status(500).send(err));
  },
  /**
   * Generates a new random password for a user, with given email
   * @param req Request
   * @param res Response
   * @returns {JSON}
   */
  set_new_password: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.email != 'string') return res.status(400).send();

    User.findOne({ where: { email: req.body.email } })
      .then(users => {
        if (!users) return res.status(404).send({ msg: 'Bruker ikke funnet.' });
        const generated_pwd = Math.random()
          .toString(36)
          .slice(-8);
        const pwd_obj = hashPassword(generated_pwd);
        const hashed_password = pwd_obj.passwordHash;
        const salt = pwd_obj.salt;

        User.update(
          {
            hashed_password: hashed_password,
            salt: salt
          },
          { where: { email: req.body.email } }
        )
          .then(user => {
            if (!user) return res.status(404).send();
            Epost.send_email(req.body.email, 'Nytt passord', `Nytt passord: ${generated_pwd}`);
            return res.status(200).send({ msg: 'Nytt passord satt, og epost sendt.' });
          })
          .catch(error => {
            return res.status(500).json(error);
          });
      })
      .catch(error => {
        return res.status(500).json(error);
      });
  }
};
