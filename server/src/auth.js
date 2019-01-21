import { User, sequelize } from './models.js';
const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

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
let genRandomString = function(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

let sha512 = function(password, salt) {
  let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
};

export function hashPassword(password, salt = genRandomString(32)) {
  let passwordHash = sha512(password, salt);
  return passwordHash;
}

export function createToken(accessLevel, user_id) {
  const payload = {
    accesslevel: accessLevel,
    user_id: user_id
  };

  const signOptions = {
    issuer: 'Hverdagshelter',
    subject: 'access-token',
    expiresIn: '12h',
    algorithm: 'RS256'
  };
  return jwt.sign(payload, privateKEY, signOptions);
}

export function verifyToken(token) {
  const verifyOptions = {
    issuer: 'Hverdagshelter',
    subject: 'access-token',
    expiresIn: '12h',
    algorithm: ['RS256']
  };
  try {
    return jwt.verify(token, publicKEY, verifyOptions);
  } catch (err) {
    return false;
  }
}

export async function loginOk(email, password) {
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

export function reqAccessLevel(req, res, accessLevel = 4, wrappedFunction) {
  if (!req.token) return res.sendStatus(400);
  let token = req.token;
  let decoded = verifyToken(token);
  console.log(token in tokens);
  console.log(tokens);
  if (decoded && decoded.accesslevel <= accessLevel && token in tokens) {
    console.log(token);
    return wrappedFunction(req, res);
  } else {
    return res.sendStatus(403);
  }
}

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
    return res.sendStatus(403);
  }
}

export function logout(req: Request, res: Response) {
  if (!req.token) {
    return res.sendStatus(400);
  } else {
    let token = req.token;
    delete tokens[token];
    return res.sendStatus(200);
  }
}
