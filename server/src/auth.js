// @flow

import { User, sequelize } from './models.js';
const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

type Request = express$Request;
type Response = express$Response;

const privatePath = path.join(__dirname, 'private.key');
const publicPath = path.join(__dirname, 'public.key');
const privateKEY = fs.readFileSync(privatePath, 'utf-8');
const publicKEY = fs.readFileSync(publicPath, 'utf-8');
let tokens = {};

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
let genRandomString = function(length: number) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

/**
 * generates a password object containing the password-hash
 * and salt used in the hash.
 * @param password
 * @param salt
 * @returns {{salt: *, passwordHash: string}}
 */
let sha512 = function(password: string, salt: string) {
  let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
};

/**
 * uses a specified salt, if give, to create a passwordHash object
 * @param password - password to hash
 * @param salt - specific salt to use, if not given a salt is generated
 * @returns {{salt: *, passwordHash: string}}
 */
export function hashPassword(password: string, salt: string = genRandomString(32)) {
  let passwordHash = sha512(password, salt);
  return passwordHash;
}

/**
 * creates a token with accessLevel and user_id in payload
 * @param accessLevel {number}
 * @param user_id {number}
 * @returns {*}
 */
export function createToken(accessLevel: number, user_id: number) {
  const payload = {
    accesslevel: accessLevel,
    user_id: user_id
  };

  const signOptions = {
    issuer: 'Hverdagshelter',
    subject: 'access-token',
    expiresIn: '24h',
    algorithm: 'RS256'
  };
  return jwt.sign(payload, privateKEY, signOptions);
}

/**
 * verifies if a token is valid
 * @param token {strig}
 * @returns {*} 'token' if valid, false if not
 */
export function verifyToken(token: string) {
  const verifyOptions = {
    issuer: 'Hverdagshelter',
    subject: 'access-token',
    expiresIn: '24h',
    algorithm: ['RS256']
  };
  try {
    return jwt.verify(token, publicKEY, verifyOptions);
  } catch (err) {
    return false;
  }
}

/**
 * checks if given password matches to the password stored in the database
 * with the same email.
 * @param email {string}
 * @param password {string}
 * @returns {Promise<*>}
 */
export async function loginOk(email: string, password:string) {
  let user = sequelize.query(
    'Select * FROM Users natural join Roles WHERE email = ?',
    { replacements: [email] },
    { type: sequelize.QueryTypes.SELECT }
  );
  let result = await user;
  let userObj = result[0][0];
  if (!userObj) {
    return null;
  }
  let salt = userObj.salt;
  let password_hash = userObj.hashed_password;
  let givenPassword = hashPassword(password, salt);
  if (givenPassword.passwordHash !== password_hash) {
    return null;
  } else {
    return userObj;
  }
}

/**
 * Wrapper function that tests if a Bearertoken is authentic
 * and that the accesslevel is sufficient. Removes token from tokens if token has expired.
 * @param req Request
 * @param res Response
 * @param accessLevel number - required access level
 * @param wrappedFunction function - the function to execute if the check is ok.
 * @returns {*}
 */
export function reqAccessLevel(req: Request, res: Response, accessLevel: number = 4, wrappedFunction) {
  if (!req.token) return res.status(403).send({ msg: "User not logged in." });
  let token: string = req.token;
  let decoded = verifyToken(token);
  if (decoded && decoded.accesslevel <= accessLevel && token in tokens) {
    return wrappedFunction(req, res);
  } else {
    if(!decoded && token in tokens){
      delete tokens[token];
      return res.status(403).send( {msg: "Token has expired."});
    }
    return res.status(401).send();
  }
}

/**
 * logs in a user and returns a token in response if login is ok.
 * @param req Request
 * @param res Response
 * @returns {Promise<*>}
 */
export async function login(req: Request, res: Response) {
  if (!req.body || typeof req.body.email !== 'string' || typeof req.body.password !== 'string')
    return res.sendStatus(400);

  let login = await loginOk(req.body.email, req.body.password);
  if (login) {
    let token = createToken(login.access_level, login.user_id);
    tokens[token] = req.body.email;
    let user_obj = {...login};
    ['hashed_password', 'salt'].forEach(e => delete user_obj[e]);
    let return_data = {
      token: token,
      user: user_obj
    };
    return res.status(200).send(return_data);
  } else {
    return res.sendStatus(401);
  }
}

/**
 * logs out a user
 * @param req Request
 * @param res Response
 * @returns res Response
 */
export function logout(req: Request, res: Response) {
  if (!req.token) {
    return res.sendStatus(400);
  } else {
    let token: string = req.token;
    delete tokens[token];
    return res.sendStatus(200);
  }
}

/**
 * removes a given token from the server session.
 * @param token
 * @returns {boolean}
 */
export function remove_token(token: string) {
  if(token in tokens) {
    delete tokens[token];
  }
  return true
}
