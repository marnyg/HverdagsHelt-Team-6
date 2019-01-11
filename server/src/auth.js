import { User, sequelize } from './models.js';
const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const privatePath = path.join(__dirname, 'private.key');
const publicPath = path.join(__dirname, 'public.key');
const privateKEY = fs.readFileSync(privatePath, 'utf-8');
const publicKEY = fs.readFileSync(publicPath, 'utf-8');

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
  /*let user = User.findOne(
        {where: {email: String(email) }}
    );*/
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
  console.log(userObj);
  let salt = userObj.salt;
  let password_hash = userObj.hashed_password;
  let givenPassword = hashPassword(password, salt);
  if (givenPassword.passwordHash !== password_hash) {
    return null;
  }
  console.log('--------- SALT ----------' + salt + ' hash: ' + password_hash);
  return userObj;
}

export function reqAccessLevel(req, res, accessLevel = 4, wrappedFunction) {
  let token = verifyToken(req.token);
  if (token && (token.accesslevel <= accessLevel)) {
    console.log(token);
    return wrappedFunction(req, res);
  } else {
    return res.sendStatus(403);
  }
}
