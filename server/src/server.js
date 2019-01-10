// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { hashPassword } from './auth.js';
import { User } from './models.js';
import { Role } from './models.js';
import { Region } from './models.js';
import { County } from './models.js';
import { Case_subscriptions, Category, Region_subscriptions } from './models';
import { Case } from './models.js';

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json

app.get('/api/cases', (req: Request, res: Response) => {
  return Case.findAll().then(cases => res.send(cases));
});

app.post('/api/cases', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.title != 'string' ||
    typeof req.body.description != 'string' ||
    typeof req.body.lat != 'number' ||
    typeof req.body.lon != 'number' ||
    typeof req.body.region_id != 'number' ||
    typeof req.body.user_id != 'number' ||
    typeof req.body.category_id != 'number' ||
    typeof req.body.status_id != 'number'
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
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.get('/api/cases/user_cases/:user_id', (req: Request, res: Response) => {
  return Case.findAll({
    where: {
      user_id: req.params.user_id
    },
    order: [['createdAt', 'DESC']] //Order by updatedAt????
  }).then(cases => res.send(cases));
});

app.get('/api/cases/:case_id', (req: Request, res: Response) => {
  return Case.findOne({ where: { case_id: Number(req.params.case_id) } }).then(cases =>
    cases ? res.send(cases) : res.sendStatus(404)
  );
});

app.put('/api/cases/:case_id', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.title != 'string' ||
    typeof req.body.description != 'string' ||
    typeof req.body.lat != 'number' ||
    typeof req.body.lon != 'number' ||
    typeof req.body.region_id != 'number' ||
    typeof req.body.user_id != 'number' ||
    typeof req.body.category_id != 'number' ||
    typeof req.body.status_id != 'number'
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
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.delete('/api/cases/:case_id', (req: Request, res: Response) => {
  return Case.destroy({ where: { case_id: Number(req.params.case_id) } }).then(cases =>
    cases ? res.send() : res.status(500).send()
  );
});

app.post('/api/cases/:case_id/subscribe', (req: Request, res: Response) => {
  let case_id = Number(req.params.case_id);
  if (
    !req.body ||
    typeof req.body.user_id != 'number' ||
    typeof req.body.case_id != 'number' ||
    typeof req.body.notify_by_email != 'boolean' ||
    typeof req.body.is_up_to_date != 'boolean'
  )
    return res.sendStatus(400);

  return Case_subscriptions.create({
    user_id: req.body.user_id,
    case_id: Number(req.params.case_id),
    notify_by_email: req.body.notify_by_email,
    is_up_to_date: req.body.is_up_to_date
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.delete('/api/cases/:case_id/subscribe', (req: Request, res: Response) => {
  return Case_subscriptions.destroy({
    where: { case_id: Number(req.params.case_id), user_id: Number(req.body.user_id) }
  }).then(cases => (cases ? res.send() : res.status(500).send()));
});

app.get('/api/cases/subscriptions/:user_id', (req: Request, res: Response) => {
  return Case_subscriptions.findAll({
    where: {
      user_id: req.params.user_id
    }
  }).then(cases => res.send(cases));
});

app.get('/api/users', (req: Request, res: Response) => {
  return User.findAll().then(users => res.send(users));
});

app.post('/api/users', (req: Request, res: Response) => {
  console.log('Recieved post request for /api/users');
  if (
    !req.body ||
    typeof req.body.firstname != 'string' ||
    typeof req.body.lastname != 'string' ||
    typeof req.body.tlf != 'number' ||
    typeof req.body.email != 'string' ||
    typeof req.body.password != 'string' ||
    typeof req.body.region_id != 'number'
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
    role_id: 1,
    region_id: req.body.region_id
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.get('/api/users/:user_id', (req: Request, res: Response) => {
  return User.findOne({ where: { user_id: Number(req.params.user_id) } }).then(user =>
    user ? res.send(user) : res.sendStatus(404)
  );
});

app.put('/api/users/:user_id', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.firstname != 'string' ||
    typeof req.body.lastname != 'string' ||
    typeof req.body.tlf != 'number' ||
    typeof req.body.email != 'string' ||
    typeof req.body.region_id != 'number'
  )
    return res.sendStatus(400);

  return User.update(
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      tlf: req.body.tlf,
      email: req.body.email,
      region_id: req.body.region_id
    },
    { where: { user_id: req.params.user_id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.delete('/api/users/:user_id', (req: Request, res: Response) => {
  return User.destroy({ where: { user_id: Number(req.params.user_id) } }).then(user =>
    user ? res.send() : res.status(500).send()
  );
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
    ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
  } else {
    return res.sendStatus(403);
  }
});

app.get('/api/counties', (req: Request, res: Response) => {
  return County.findAll().then(counties => res.send(counties));
});

app.get('/api/regions', (req: Request, res: Response) => {
  return Region.findAll().then(regions => res.send(regions));
});

app.post('/api/regions', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.name != 'string' ||
    typeof req.body.lat != 'number' ||
    typeof req.body.lon != 'number' ||
    typeof req.body.county_id != 'number'
  )
    return res.sendStatus(400);
  return Region.create({
    name: req.body.name,
    lat: req.body.lat,
    lon: req.body.lon,
    county_id: req.body.county_id
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.get('/api/regions/:region_id', (req: Request, res: Response) => {
  return Region.findOne({ where: { region_id: Number(req.params.region_id) } }).then(
    region => (region ? res.send(region) : res.sendStatus(404))
  );
});

app.put('/api/regions/:region_id', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.region_id != 'number' ||
    typeof req.body.name != 'string' ||
    typeof req.body.lat != 'number' ||
    typeof req.body.lon != 'number' ||
    typeof req.body.county_id != 'number'
  )
    return res.sendStatus(400);

  return Region.update(
    {
      name: req.body.name,
      lat: req.body.lat,
      lon: req.body.lon,
      county_id: req.body.county_id
    },
    { where: { region_id: Number(req.params.region_id) } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.delete('/api/regions/:region_id', (req: Request, res: Response) => {
  return Region.destroy({ where: { region_id: Number(req.params.region_id) } }).then(
    regions => (regions ? res.send() : res.status(500).send())
  );
});

app.get('/api/regions/:region_id/subscribe', (req: Request, res: Response) => {
  return Region_subscriptions.findAll().then(subs => res.send(subs));
});

app.post('/api/regions/:region_id/subscribe', (req: Request, res: Response) => {
  let region_id = Number(req.params.region_id);
  if (
    !req.body ||
    typeof req.body.user_id != 'number' ||
    typeof region_id != 'number' ||
    typeof req.body.notify != 'boolean'
  )
    return res.sendStatus(400);

  return Region_subscriptions.create({
    user_id: req.body.user_id,
    region_id: Number(req.params.region_id),
    notify: req.body.notify
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.put('/api/regions/:region_id/subscribe', (req: Request, res: Response) => {
  let region_id = Number(req.params.region_id);
  if (
    !req.body ||
    typeof req.body.user_id != 'number' ||
    typeof region_id != 'number' ||
    typeof req.body.notify != 'boolean'
  )
    return res.sendStatus(400);
  return Region_subscriptions.update(
    {
      notify: req.body.notify
    },
    { where: { region_id: region_id, user_id: req.body.user_id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.delete('/api/regions/:region_id/subscribe', (req: Request, res: Response) => {
  return Region_subscriptions.destroy({
    where: { region_id: Number(req.params.region_id), user_id: req.body.user_id }
  }).then(region => (region ? res.send() : res.status(500).send()));
});

app.get('/api/email_available', (req: Request, res: Response) => {
  return User.findAll().then(users => res.send(!users.some(user => user.email === req.body.email)));
});

app.get('/api/categories', (req: Request, res: Response) => {
  return Category.findAll().then(categories => res.send(categories));
});

app.post('/api/categories', (req: Request, res: Response) => {
  if (!req.body || typeof req.body.name != 'string') return res.sendStatus(400);
  return Category.create({
    name: req.body.name
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.put('/api/categories/:category_id', (req: Request, res: Response) => {
  if (!req.body || typeof req.body.name != 'string') return res.sendStatus(400);
  return Category.update(
    {
      name: req.body.name
    },
    { where: { category_id: Number(req.params.category_id) } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.delete('/api/categories/:category_id', (req: Request, res: Response) => {
    return Category.destroy({
        where: { category_id: Number(req.params.category_id) }
    }).then(category => (category ? res.send() : res.status(500).send()));
});

// Hot reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
  app.listen(3000, error => {
    if (error) reject(error.message);
    console.log('Server started on port 3000');
    resolve();
  });
});
