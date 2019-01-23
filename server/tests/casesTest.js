import { application } from '../src/server';
import request from 'supertest';

let admin_token;
let user_token;
let user_id;
let user_token_invalid;

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
  request(application)
    .post('/api/login')
    .send({
      email: 'ole.nordmann@gmail.com',
      password: 'passord123'
    })
    .end((err, res) => {
      user_token_invalid = res.body.token;
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
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for POST /api/cases without valid token', done => {
    request(application)
      .post('/api/cases')
      .set('Authorization', `Bearer ${10000}`)
      .accept('application/json')
      .field('title', 'Ny sak')
      .field('description', 'Test test')
      .field('lat', 1000)
      .field('lon', 12)
      .field('category_id', 1)
      .field('region_id', 44)
      .field('status_id', 1)
      .attach('images', null)
      .then(response => {
        case_id = response.body.case_id;
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for POST /api/cases without token', done => {
    request(application)
      .post('/api/cases')
      .then(response => {
        case_id = response.body.case_id;
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('409 status code for POST /api/cases when this case is a duplicate', done => {
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
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for POST /api/cases', done => {
    request(application)
      .post('/api/cases')
      .set('Authorization', `Bearer ${user_token}`)
      .accept('application/json')
      .field('title', 'En helt ny sak')
      .field('description', 'Test test')
      .field('lat', 90)
      .field('lon', 70)
      .field('category_id', 1)
      .field('region_id', 1)
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
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for PUT /api/cases/:case_id with invalid case_id', done => {
    return request(application)
      .put(`/api/cases/NaN`)
      .set('Authorization', `Bearer ${user_token}`)
      .send({
        title: "Oppdaterer",
        description: "test test på sak",
        lat: 10,
        lon: 12,
        region_id: 44,
        category_id: 1,
        status_id: 1
      })
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for PUT /api/cases/:case_id with invalid user_id', done => {
    return request(application)
      .put(`/api/cases/${case_id}`)
      .set('Authorization', `Bearer ${user_token_invalid}`)
      .send({
        title: "Oppdaterer",
        description: "test test på sak",
        lat: 10,
        lon: 12,
        region_id: 44,
        category_id: 1,
        status_id: 1
      })
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for PUT /api/cases/:case_id without token', done => {
    return request(application)
      .put(`/api/cases/${case_id}`)
      .send({
        title: "Oppdaterer",
        description: "test test på sak",
        lat: 10,
        lon: 12,
        region_id: 44,
        category_id: 1,
        status_id: 1
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/cases/:case_id', done => {
    return request(application)
      .put(`/api/cases/${case_id}`)
      .set('Authorization', `Bearer ${user_token}`)
      .send({
          title: "Oppdaterer",
          description: "test test på sak",
          lat: 10,
          lon: 12,
          region_id: 44,
          category_id: 1,
          status_id: 1
      })
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
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for DELETE /api/cases/:case_id without valid token', done => {
    request(application)
      .delete(`/api/cases/${case_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for DELETE /api/cases/:case_id without token', done => {
    request(application)
      .delete(`/api/cases/${case_id}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('404 status code for DELETE /api/cases/:case_id} without valid case_id', done => {
    request(application)
      .delete(`/api/cases/135`)
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
});

describe('Find all cases in a region by name', () => {
  test('200 status code for GET /api/cases/region_cases/:county_name/:region_name', done => {
    return request(application)
      .get('/api/cases/region_cases/Trøndelag/Trondheim')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('400 status code for GET /api/cases/region_cases/:county_name/:region_name with only one name', done => {
    return request(application)
      .get('/api/cases/region_cases/Trøndelag')
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
});

describe('Find all cases in a region by region_id', () => {
  test('400 status code for GET /api/cases/region_cases/:region_id without valid id', done => {
    return request(application)
      .get('/api/cases/region_cases/NaN')
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('200 status code for GET /api/cases/region_cases/:region_id', done => {
    return request(application)
      .get('/api/cases/region_cases/44')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Find all cases for one user', () => {
  test('400 status code for GET /api/cases/user_cases/:user_id with invalid id', done => {
    request(application)
      .get(`/api/cases/user_cases/NaN`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for GET /api/cases/user_cases/:user_id without valid token', done => {
    request(application)
      .get(`/api/cases/user_cases/${user_id}`)
      .set('Authorization', `Bearer ${user_token_invalid}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for GET /api/cases/user_cases/:user_id without token', done => {
    request(application)
      .get(`/api/cases/user_cases/${user_id}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/cases/user_cases/:user_id with user_token', done => {
    request(application)
      .get(`/api/cases/user_cases/${user_id}`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('200 status code for GET /api/cases/user_cases/:user_id with admin_token', done => {
    request(application)
      .get(`/api/cases/user_cases/${user_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});