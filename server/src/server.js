// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import bearerToken from 'express-bearer-token';
import { hashPassword, reqAccessLevel, login, logout, createToken, loginOk } from './auth.js';
import Users from './routes/Users.js';
import Category from './routes/Categories.js';
import Region_subscriptions from './routes/Region_subscriptions.js';
import Region from './routes/Region.js';
import County from './routes/Counties.js';
import Role from './routes/Roles.js';
import Status from './routes/Statuses.js';
import Case_subscription from './routes/Case_subscriptions.js';
import Status_comment from './routes/Status_comments.js';
import { Case } from './models.js';
import type { Model } from 'sequelize';
import Sequelize from 'sequelize';

let tokens = {};

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json
app.use(bearerToken()); // For easy access to token sent in 'Authorization' header.

app.get('/api/cases', (req: Request, res: Response) => {
  return Case.findAll().then(cases => res.send(cases));
});

app.get('/api/verify', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, (req, res) => {
    console.log('------Token Verified!-------');
    return res.sendStatus(200);
  });
});

app.post('/api/login', (req: Request, res: Response) => {
  return login(req, res);
});

app.post('/api/logout', (req: Request, res: Response) => {
  return logout(req, res);
});

app.post('/api/cases', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.title !== 'string' ||
    typeof req.body.description !== 'string' ||
    typeof req.body.lat !== 'number' ||
    typeof req.body.lon !== 'number' ||
    typeof req.body.region_id !== 'number' ||
    typeof req.body.user_id !== 'number' ||
    typeof req.body.category_id !== 'number' ||
    typeof req.body.status_id !== 'number'
  )
    return res.sendStatus(400);

  return Case.create({
    title: req.body.title,
    description: req.body.description,
    lat: req.body.lat,
    lon: req.body.lon,
    region_id: req.body.region_id,
    user_id: req.body.user_id,
    category_id: req.body.category_id,
    status_id: req.body.status_id
  }).then(cases => (cases ? res.send(cases) : res.sendStatus(404)));
});

app.get('/api/cases/user_cases/:user_id', (req: Request, res: Response) => {
  return Case.findAll({
    where: {
      user_id: req.params.user_id
    },
    order: [['createdAt', 'DESC']] //Order by updatedAt????
  }).then(cases => res.send(cases));
});

app.get('/api/cases/:case_id/status_comments', (req: Request, res: Response) => {
  Status_comment.getAllStatus_comment(req, res);
});

app.post('/api/cases/:case_id/status_comments', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 2, Status_comment.addStatus_comment);
});

app.put('/api/cases/:case_id/status_comments/:status_comment_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 2, Status_comment.updateStatus_comment);
});

app.delete('/api/cases/:case_id/status_comments/:status_comment_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 2, Status_comment.delStatus_comment);
});

app.get('/api/cases/:case_id', (req: Request, res: Response) => {
  return Case.findOne({ where: { case_id: Number(req.params.case_id) } }).then(cases =>
    cases ? res.send(cases) : res.sendStatus(404)
  );
});

app.put('/api/cases/:case_id', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.title !== 'string' ||
    typeof req.body.description !== 'string' ||
    typeof req.body.lat !== 'number' ||
    typeof req.body.lon !== 'number' ||
    typeof req.body.region_id !== 'number' ||
    typeof req.body.user_id !== 'number' ||
    typeof req.body.category_id !== 'number' ||
    typeof req.body.status_id !== 'number'
  )
    return res.sendStatus(400);

  return Case.update(
    {
      title: req.body.title,
      description: req.body.description,
      lat: req.body.lat,
      lon: req.body.lon,
      region_id: req.body.region_id,
      user_id: req.body.user_id,
      category_id: req.body.category_id,
      status_id: req.body.status_id
    },
    { where: { case_id: req.params.case_id } }
  ).then(cases => (cases ? res.send(cases) : res.sendStatus(404)));
});

app.delete('/api/cases/:case_id', (req: Request, res: Response) => {
  return Case.destroy({ where: { case_id: Number(req.params.case_id) } }).then(cases =>
    cases ? res.send() : res.status(500).send()
  );
});

app.get('/api/cases/subscriptions/:user_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.getAllCase_subscriptions);
});

app.post('/api/cases/:case_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.addCase_subscriptions);
});

app.put('/api/cases/:case_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.updateCase_subscriptions);
});

app.delete('/api/cases/:case_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.delCase_subscriptions);
});

app.get('/api/cases/region_cases/:county_name/:region_name', async (req: Request, res: Response) => {
  let region = await Region.getOneRegionByNameAndCounty(req, res);
  let regionId = region ? region : res.sendStatus(404);
  let cases = await Case.findAll({ where: { region_id: Number(regionId.region_id) }, order: [['updatedAt', 'DESC']] });
  cases = cases.map(c => c.toJSON());
  const out = cases.map(async c => {
    c.img = await Picture.findAll({ where: { case_id: c.case_id }, attributes: ['path'] });
    return c;
  });
  Promise.all(out).then(cases => (cases ? res.send(cases) : res.sendStatus(404)));
});

app.get('/api/statuses', (req: Request, res: Response) => {
  Status.getAllStatuses(req, res);
});

app.post('/api/statuses', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Status.addStatus);
});

app.put('/api/statuses/:status_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Status.updateStatus);
});

app.delete('/api/statuses/:status_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Status.delStatus);
});

app.get('/api/roles', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Role.getAllRoles);
});

app.post('/api/roles', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Role.addRole);
});

app.put('/api/roles/:role_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Role.updateRole);
});

app.delete('/api/roles/:role_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Role.delRole);
});

app.get('/api/users', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Users.getAllUsers);
});

app.post('/api/users', (req: Request, res: Response) => {
  Users.createUser(req, res);
});

app.get('/api/users/:user_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Users.getOneUser);
});

app.put('/api/users/:user_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Users.updateOneUser);
});

app.delete('/api/users/:user_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Users.deleteOneUser);
});

app.put('/api/users/:user_id/password', async (req: Request, res: Response) => {
  if (!req.body || typeof req.body.old_password !== 'string' || typeof req.body.new_password !== 'string')
    return res.sendStatus(400);

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
    ).then(user => (user ? res.send(user) : res.sendStatus(404)));
  } else {
    return res.sendStatus(403);
  }
});

app.get('/api/counties', (req: Request, res: Response) => {
  County.getAllCounties(req, res);
});

app.post('/api/counties', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, County.addCounty);
});

app.put('/api/counties/:county_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, County.updateCounty);
});

app.delete('/api/counties/:county_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, County.delCounty);
});

app.get('/api/counties/:county_id/regions', (req: Request, res: Response) => {
  Region.getAllRegionsInCounty(req, res);
});

app.get('/api/regions', (req: Request, res: Response) => {
  Region.getAllRegions(req, res);
});

app.post('/api/regions', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Region.addRegion);
});

app.get('/api/regions/:region_id', (req: Request, res: Response) => {
  Region.getRegion(req, res);
});

app.put('/api/regions/:region_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Region.updateRegion);
});

app.delete('/api/regions/:region_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Region.delRegion);
});

app.get('/api/regions/:region_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Region_subscriptions.getAllRegion_subscriptions);
});

app.post('/api/regions/:region_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Region_subscriptions.addRegion_subscriptions);
});

app.put('/api/regions/:region_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Region_subscriptions.updateRegion_subscriptions);
});

app.delete('/api/regions/:region_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Region_subscriptions.delRegion_subscriptions);
});

app.get('/api/email_available', (req: Request, res: Response) => {
  return User.findAll().then(users => res.send(!users.some(user => user.email === req.body.email)));
});

app.get('/api/categories', (req: Request, res: Response) => {
  Category.getAllCategories(req, res);
});

app.post('/api/categories', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Category.addCategory);
});

app.put('/api/categories/:category_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Category.updateCategory);
});

app.delete('/api/categories/:category_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, Category.delCategory);
});

// Hot reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

export let application = app;

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
  app.listen(3000, error => {
    if (error) reject(error.message);
    console.log('Server started on port 3000');
    resolve();
  });
});
