//
import { application } from '../src/server';
import request from 'supertest';

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
        expect(response.data).toEqual();
        done();
      });
  });
});

/*
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
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});
*/

describe('GET /api/cases/user_cases/{user_id}', () => {
  test('200 status code for GET case with case_id = 1', done => {
    request(application)
      .get('/api/cases/user_cases/1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/region_cases/{county_name}/{region_name}', () => {
  test('200 status code for GET Trøndelag/Trondheim', done => {
    request(application)
      .get('/api/cases/region_cases/Trøndelag/Trondheim')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let case_id = 13;

describe('GET /api/cases/{case_id}', () => {
  test('200 status code for GET with case id = ' + case_id, done => {
    request(application)
      .get('/api/cases/user_cases/' + case_id)
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
  test('200 status code for PUT with case_id = ' + case_id, done => {
    request(application)
      .put('/api/cases/' + case_id)
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('DELETE /api/cases/{case_id}', () => {
  test('200 status code for GET with case_id = ' + case_id, done => {
    request(application)
      .delete('/api/cases/' + case_id)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('POST /api/cases/{case_id}/subscribe', () => {
  let data = {
    user_id: 1,
    notify_by_email: true,
    is_up_to_date: true
  };
  test('200 status code for POST with case id = 1', done => {
    request(application)
      .post('/api/cases/1/subscribe')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('DELETE /api/cases/{case_id}/subscribe', () => {
  let data = {
    user_id: 1
  };
  test('200 status code for DELETE with case id = 1', done => {
    request(application)
      .delete('/api/cases/1/subscribe')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
