// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
const multer = require('multer');
import crypto from 'crypto';
import bearerToken from 'express-bearer-token';
import { reqAccessLevel, login, logout } from './auth.js';
import Cases from './routes/Cases.js';
import Users from './routes/Users.js';
import Category from './routes/Categories.js';
import Region_subscriptions from './routes/Region_subscriptions.js';
import Region from './routes/Regions.js';
import County from './routes/Counties.js';
import Role from './routes/Roles.js';
import Status from './routes/Statuses.js';
import Case_subscription from './routes/Case_subscriptions.js';
import Status_comment from './routes/Status_comments.js';
import Pictures from './routes/Pictures.js';
import { Case } from './models.js';
import type { Model } from 'sequelize';
import Sequelize from 'sequelize';

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json
app.use(bearerToken()); // For easy access to token sent in 'Authorization' header.

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

let upload = multer({ storage: storage });

app.post('/api/uploads', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    console.log('No file received');
    return res.send({
      success: false
    });
  } else {
    console.log('file received');
    console.log(req.files);
    console.log(req.body.alt);
    return res.send({
      success: true
    });
  }
});

app.post('/api/cases', upload.array('images', 3), Cases.createNewCase);

app.get('/', (req: Request, res: Response) => res.sendFile(public_path + '/index.html'));

app.get('/api/cases', (req: Request, res: Response) => Cases.getAllCases(req, res));

app.post('/api/verify', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, (req, res) => {
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

app.post('/api/pictures/:case_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Pictures.uploadPicture);
});

app.del('/api/pictures/:case_id/:image_name', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Pictures.delPicture);
});

app.get('/api/cases/:case_id', (req: Request, res: Response) => Cases.getOneCase(req, res));

app.get('/api/cases/user_cases/:user_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Cases.getAllCasesForUser);
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

app.put('/api/cases/:case_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Cases.updateCase);
});

app.delete('/api/cases/:case_id', (req: Request, res: Response) => {
  return Case.destroy({ where: { case_id: Number(req.params.case_id) } }).then(
    cases => (cases ? res.send() : res.status(500).send())
  );
});

app.get('/api/cases/subscriptions/:user_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.getAllCase_subscriptions);
});

app.get('/api/cases/subscriptions/:user_id/cases', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.getAllCase_subscriptionCases);
});

app.get('/api/cases/subscriptions/:user_id/cases/is_up_to_date', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.getAllCase_subscriptionCasesIs_up_to_date);
});

app.post('/api/cases/:case_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.addCase_subscriptions);
});

app.put('/api/cases/:case_id/subscribe', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.updateCase_subscriptions);
});

app.delete('/api/cases/:case_id/subscribe/:user_id', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Case_subscription.delCase_subscriptions);
});

app.get('/api/cases/region_cases/:county_name/:region_name', async (req: Request, res: Response) => {
  return Cases.getAllCasesInRegionByName(req, res);
});

app.get('/api/cases/region_cases/:region_id', async (req: Request, res: Response) => {
  return Cases.getAllCasesInRegionById(req, res);
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
  console.log(req.body);
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
  reqAccessLevel(req, res, 4, Users.changePassword);
});

app.get('/api/users/:user_id/region_subscriptions', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 4, Users.getRegionSubscriptionsForUser);
});

app.get('/api/counties', (req: Request, res: Response) => {
  County.getAllCounties(req, res);
});

app.post('/api/counties', (req: Request, res: Response) => {
  reqAccessLevel(req, res, 1, County.addCounty);
});

app.get('/api/counties/:county_name', (req: Request, res: Response) => {
  County.getOneCountyByName(req,res);
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
  console.log(req.body);
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

app.get('/api/search/:searchtext', (req: Request, res: Response) => {
  Cases.search(req, res);
});

app.get('/*', (req, res) => {
  res.redirect('/');
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
