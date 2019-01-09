// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Region } from './models.js';
import { County } from './models.js';

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json

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
  return Region.findOne({ where: { id: Number(req.params.id) } }).then(
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
    region => (region ? res.send() : res.status(500).send())
  );
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
