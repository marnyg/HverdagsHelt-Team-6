import { application } from '../src/server';
import request from 'supertest';

let county_id = 1;
let county_name = 'Trøndelag';
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

// ***************** Counties *****************
describe('Find all counties', () => {
  test('200 status code for GET /api/counties', done => {
    return request(application)
      .get('/api/counties')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let ny_id;
describe('Create one county', () => {
  test('400 status code for POST /api/counties without body', done => {
    request(application)
      .post('/api/counties')
      .send()
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for POST /api/counties without valid token', done => {
    request(application)
      .post('/api/counties')
      .send({ name: 'Nytt fylke' })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/counties', done => {
    request(application)
      .post('/api/counties')
      .send({
        name: 'Nytt fylke'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        ny_id = response.body.county_id;
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

describe('Find one county by name', () => {
  test('200 status code for GET /api/counties/:county_name', done => {
    request(application)
      .get(`/api/counties/${county_name}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('400 status code for GET /api/counties/:county_name number for name', done => {
    request(application)
      .get('/api/counties/1234')
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('404 status code for GET /api/counties/:county_name with invalid name', done => {
    request(application)
      .get('/api/counties/Heipådeg')
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
});

describe('Update one county', () => {
  test('400 status code for PUT /api/counties/{county_id} without body', done => {
    return request(application)
      .put(`/api/counties/${ny_id}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for PUT /api/counties/{county_id} without valid token', done => {
    return request(application)
      .put(`/api/counties/${ny_id}`)
      .send({ name: 'Nyeste fylke' })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/counties/{county_id}', done => {
    return request(application)
      .put(`/api/counties/${ny_id}`)
      .send({
        name: 'Nyeste fylke'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one county', () => {
  test('400 status code for DELETE /api/counties/{county_id} with invalid id', done => {
    request(application)
      .delete(`/api/counties/${'Not a number'}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for DELETE /api/counties/{county_id} without valid token', done => {
    request(application)
      .delete(`/api/counties/${ny_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('404 status code for DELETE /api/counties/{county_id} without county_id', done => {
    request(application)
      .delete(`/api/counties`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('409 status code for DELETE /api/counties/{county_id} when id is connected to cases', done => {
    request(application)
      .delete(`/api/counties/${county_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for DELETE /api/counties/{county_id}', done => {
    request(application)
      .delete(`/api/counties/${ny_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
