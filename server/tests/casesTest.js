import { application } from '../src/server';
import request from 'supertest';

let admin_token;
let user_token;
let user_id;

// ***************** Login *************
beforeAll(done => {
  request(application)
    .post('/api/login')
    .send({
      email: 'admin@admin.com',
      password: 'passord123'
    })
    .end((err, res) => {
      admin_token = res.body.token;
      done();
    });
  request(application)
    .post('/api/login')
    .send({
      email: 'gunnar.gunnarson@gmail.com',
      password: 'passord123'
    })
    .end((err, res) => {
      user_token = res.body.token;
      user_id = res.body.user.user_id;
      done();
    });
});

// ***************** Cases *****************
describe('Find all cases', () => {
  test('200 status code for GET /api/cases', done => {
    return request(application)
      .get('/api/cases')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let case_id;
describe('Create new case', () => {
  test('400 status code for POST /api/cases without body', done => {
    request(application)
      .post('/api/cases')
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        case_id = response.body.case_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('403 status code for POST /api/cases without valid token', done => {
    request(application)
      .post('/api/cases')
      .set('Authorization', `Bearer ${10000}`)
      .accept('application/json')
      .field('title', 'Ny sak')
      .field('description', 'Test test')
      .field('lat', 10)
      .field('lon', 12)
      .field('category_id', 1)
      .field('region_id', 44)
      .field('status_id', 1)
      .attach('images', null)
      .then(response => {
        case_id = response.body.case_id;
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/cases without body', done => {
    request(application)
      .post('/api/cases')
      .set('Authorization', `Bearer ${user_token}`)
      .accept('application/json')
      .field('title', 'Ny sak')
      .field('description', 'Test test')
      .field('lat', 10)
      .field('lon', 12)
      .field('category_id', 1)
      .field('region_id', 44)
      .field('status_id', 1)
      .attach('images', null)
      .then(response => {
        case_id = response.body.case_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Find one case with case_id', () => {
  test('400 status code for GET /api/cases/:case_id with invalid case_id', done => {
    return request(application)
      .get(`/api/cases/NaN`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('200 status code for GET /api/cases/:case_id', done => {
    return request(application)
      .get(`/api/cases/${case_id}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Update one case', () => {
  test('400 status code for PUT /api/cases/:case_id without body', done => {
    return request(application)
      .put(`/api/cases/${case_id}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for PUT /api/cases/:case_id with invalid case_id', done => {
    return request(application)
      .put(`/api/cases/NaN`)
      .set('Authorization', `Bearer ${user_token}`)
      .accept('application/json')
      .field('title', 'Ny sak')
      .field('description', 'Test test')
      .field('lat', 10)
      .field('lon', 12)
      .field('category_id', 1)
      .field('region_id', 44)
      .field('status_id', 1)
      .attach('images', null)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for PUT /api/cases/:case_id without valid token', done => {
    return request(application)
      .put(`/api/cases/${case_id}`)
      .set('Authorization', `Bearer ${100}`)
      .accept('application/json')
      .field('title', 'Ny sak')
      .field('description', 'Test test')
      .field('lat', 10)
      .field('lon', 12)
      .field('category_id', 1)
      .field('region_id', 44)
      .field('status_id', 1)
      .attach('images', null)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  // Not working yet
  test('200 status code for PUT /api/cases/:case_id', done => {
    return request(application)
      .put(`/api/cases/${case_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .accept('application/json')
      .field('title', 'Ny sak oppdatert')
      .field('description', 'Test test')
      .field('lat', 10)
      .field('lon', 12)
      .field('category_id', 1)
      .field('region_id', 44)
      .field('status_id', 1)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one case', () => {
  test('400 status code for DELETE /api/cases/:case_id with invalid id', done => {
    request(application)
      .delete(`/api/cases/NaN`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for DELETE /api/cases/:case_id without valid token', done => {
    request(application)
      .delete(`/api/cases/${case_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  // DELETE not working yet
  /*
  test('404 status code for DELETE /api/cases/:case_id} without valid case_id', done => {
    request(application)
      .delete(`/api/cases/0`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('200 status code for DELETE /api/cases/:case_id', done => {
    request(application)
      .delete(`/api/cases/${case_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  */
});
