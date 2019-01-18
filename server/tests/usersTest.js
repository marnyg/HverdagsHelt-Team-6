import { application } from '../src/server';
import request from 'supertest';
// ***************************** USERS **************************************

let token;
let user_id;

describe('Create new user', () => {
  let data = {
    firstname: 'Jest',
    lastname: 'Test',
    tlf: 98123456,
    email: 'jest@test.no',
    password: 'passord123',
    region_id: 1
  };
  test('400 status code for POST /api/users without body', (done) => {
    return request(application)
      .post('/api/users')
      .send()
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('200 status code for POST /api/users', (done) => {
    return request(application)
      .post('/api/users')
      .send(data)
      .then(async response => {
        user_id = response.body.user_id;
        expect(response.statusCode).toBe(200);
        expect(user_id).toBeGreaterThan(0);
        done();
      });
  });
  test('409 status code for POST /api/users with already resgistered email', (done) => {
    request(application)
      .post('/api/users')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
});

describe('User login', () => {
  let data = {
    email: 'jest@test.no',
    password: 'passord123'
  };
  test('400 status code for POST /api/login without body', (done) => {
    return request(application)
      .post('/api/login')
      .send()
      .end((err,res) => {
        expect(res.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for POST /api/login with wrong password', (done) => {
    return request(application)
      .post('/api/login')
      .send({email: 'jest@test.no', password: 'wrong'})
      .end((err,res) => {
        expect(res.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/login with correct info', (done) => {
    return request(application)
      .post('/api/login')
      .send(data)
      .then(res => {
        expect(res.statusCode).toBe(200);
        token = res.body.token; // save the token!
        //user_id = res.body.user.user_id; // save user_id
        done();
      })
  });
});

describe('Find a specific user', () => {
  test('400 status code for GET /api/users/{user_id} without token', done => {
    return request(application)
      .get(`/api/users/${user_id}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for GET /api/users/{user_id} with wrong token', done => {
    return request(application)
      .get(`/api/users/${user_id}`)
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/users/{user_id} with correct token', done => {
    return request(application)
      .get(`/api/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete a user', () => {
  test('400 status code for DELETE /api/users/ without token', done => {
    return request(application)
      .delete(`/api/users/${user_id}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for DELETE /api/users/ with wrong token', done => {
    return request(application)
      .delete(`/api/users/${user_id}`)
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for DELETE /api/users/{user_id}', done => {
    return request(application)
      .delete(`/api/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Check that the user was deleted', () => {
  test('404 status code for GET /api/users/{user_id} after deletion', done => {
    return request(application)
      .get(`/api/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
});

// GET all user, only for admins

/*
describe('GET /api/users', () => {
  test('200 status code for GET', done => {
    request(application)
      .get('/api/users')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
*/

