import { application } from '../src/server';
import request from 'supertest';
import Cases from '../src/routes/Cases';

let token;

let data = {
  email: 'ola.nordmann@gmail.com',
  password: 'passord123'
};

request(application)
  .post('/api/login')
  .send(data)
  .then(res => {
    token = res.body.token;
  });

describe('GET /api/cases', () => {
  test('200 status code for GET', done => {
    request(application)
      .get('/api/cases')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('GET method returns a list', done => {
    request(application)
      .get('/api/cases')
      .then(response => {
        expect(response.body).toBeInstanceOf(Array);
        done();
      });
  });
});

let caseid;
describe('POST /api/cases', async () => {
  let data = {
    title: 'Glatt vei',
    description: 'Veldig glatt vei i Oslo',
    lat: 63.42846459999999,
    lon: 10.388523800000002,
    region_id: 1,
    user_id: 1,
    category_id: 1,
    status_id: 1
  };
  test('200 status code for POST', function(done) {
    request(application)
      .post('/api/cases')
      .send(data)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        //console.log(response.body.case_id);
        caseid = response.body.case_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/user_cases/{user_id}', () => {
  test('200 status code for GET case with case_id = 1', done => {
    request(application)
      .get('/api/cases/user_cases/1')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/{case_id}', () => {
  test('200 status code for GET with case id = 1', done => {
    request(application)
      .get('/api/cases/user_cases/1')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('PUT /api/cases/{case_id}', () => {
  let data = {
    title: 'Istapper',
    description: 'Det er såpeglatt',
    lat: 63.42846459999999,
    lon: 10.388523800000002,
    region_id: 1,
    user_id: 1,
    category_id: 1,
    status_id: 1
  };
  test('200 status code for PUT with case_id = 1', done => {
    request(application)
      .put('/api/cases/' + caseid)
      .send(data)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
