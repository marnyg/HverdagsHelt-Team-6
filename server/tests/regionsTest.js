import { application } from '../src/server';
import request from 'supertest';

let region_id = 1;
let county_id = 1;
let admin_token;

// ***************** Login admin *************
beforeAll(done => {
  return request(application)
    .post('/api/login')
    .send({
      email: 'admin@admin.com',
      password: 'passord123'
    })
    .end((err, res) => {
      admin_token = res.body.token;
      done();
    });
});

// ***************** Regions *****************
describe('Find all regions', () => {
  test('200 status code for GET /api/regions', done => {
    return request(application)
      .get('/api/regions')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Find all regions in county', () => {
  test('200 status code for GET /api/counties/:county_id/regions', done => {
    request(application)
      .get(`/api/counties/${county_id}/regions`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Find one region', () => {
  test('200 status code for GET /api/regions/region_id', done => {
    request(application)
      .get(`/api/regions/${region_id}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('404 status code for GET /api/regions/region_id with invalid id', done => {
    request(application)
      .get('/api/regions/0')
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
});

let ny_region_id;
describe('Create one region', () => {
  test('400 status code for POST /api/regions without body', done => {
    request(application)
      .post('/api/regions')
      .send()
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for POST /api/regions without valid token', done => {
    request(application)
      .post('/api/regions')
      .send({ name: 'Ny region' })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/regions', done => {
    request(application)
      .post('/api/regions')
      .send({
        name: 'Ny region',
        lat: 66,
        lon: 55,
        county_id: county_id
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        ny_region_id = response.body.region_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Update one region', () => {
  test('400 status code for PUT /api/regions/{region_id} without body', done => {
    return request(application)
      .put(`/api/regions/${ny_region_id}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for PUT /api/regions/{region_id} without valid token', done => {
    return request(application)
      .put(`/api/regions/${ny_region_id}`)
      .send({ name: 'Nyeste region' })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/regions/{region_id}', done => {
    return request(application)
      .put(`/api/regions/${0}`)
      .send({
        name: 'Nyeste region',
        lat: 66,
        lon: 55,
        county_id: county_id
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one region', () => {
  test('400 status code for DELETE /api/regions/:region_id with invalid id', done => {
    request(application)
      .delete(`/api/regions/${0}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('404 status code for DELETE /api/regions/:region_id without id', done => {
    request(application)
      .delete(`/api/regions`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('409 status code for DELETE /api/regions/:region_id when id is connected to cases', done => {
    request(application)
      .delete(`/api/regions/${region_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for DELETE /api/regions/:region_id', done => {
    request(application)
      .delete(`/api/regions/${ny_region_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
