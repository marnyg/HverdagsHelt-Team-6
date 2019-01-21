import { application } from '../src/server';
import request from 'supertest';
import Cases from '../src/routes/Cases';
import FormData from 'form-data';



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
describe('POST /api/cases2', async () => {

    let formData = new FormData();


      formData.append("title", 'Glatt vei'),
    formData.append("description", 'Veldig glatt vei i Oslo'),
    formData.append("lat", 63.42846459999999),
    formData.append("lon", 10.388523800000002),
    formData.append("category_id", 1),
    formData.append("region_id", 1),
    formData.append("status_id", 1)

  test('200 status code for POST', function(done) {
    return request(application)
      .post('/api/cases')
      .send(formData)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        //console.log(response.body.case_id);
        caseid = response.body.case_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/user_cases/{user_id}1', () => {
  test('200 status code for GET case with case_id = 12', done => {
    request(application)
      .get('/api/cases/user_cases/1')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/{case_id}1', () => {
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
  test('200 status code for PUT with case_id = 2', done => {
    request(application)
      .put('/api/cases/1')
      .send(data)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

