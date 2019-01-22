import { application } from '../src/server';
import request from 'supertest';

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

// ***************************** USERS **************************************

let token;
let user_id;

describe('Create new user', () => {
  let data = {
    firstname: 'Jest',
    lastname: 'Test',
    tlf: 98123456,
    email: 'jest@test.no',
    password: 'Passord123',
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
  test('409 status code for POST /api/users with already registered email', (done) => {
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
    password: 'Passord123'
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
  test('400 status code for GET /api/users/{user_id} with invalid user_id', done => {
    return request(application)
      .get(`/api/users/NaN`)
      .set('Authorization', `Bearer ${token}`)
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

describe('Update data on a user', () => {
  let data = {
    firstname: 'Jest Jest',
    lastname: 'Test Test',
    tlf: 98123456,
    email: 'jest@test.no',
    password: 'Passord123',
    region_id: 1,
    role_id: 4
  };
  test('400 status code for PUT /api/users/{user_id} without body', (done) => {
    return request(application)
      .put(`/api/users/${user_id}`)
      .send()
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for PUT /api/users/{user_id} with invalid user_id', (done) => {
    return request(application)
      .put(`/api/users/NaN`)
      .send(data)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for PUT /api/users/{user_id} with invalid token', (done) => {
    return request(application)
      .put(`/api/users/${user_id}`)
      .send(data)
      .set('Authorization', `Bearer ${10000}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/users/{user_id}', (done) => {
    return request(application)
      .put(`/api/users/${user_id}`)
      .send(data)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('409 status code for PUT /api/users/{user_id} with already registered email', (done) => {
    request(application)
      .put(`/api/users/${user_id}`)
      .send({
        firstname: 'Jest Jest',
        lastname: 'Test Test',
        tlf: 98123456,
        email: 'ola.nordmann@gmail.com',
        password: 'Passord123',
        region_id: 1,
        role_id: 4
      })
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
});

describe('Change password', () => {
  test('400 status code for PUT /api/users/:user_id/password without body and token', done => {
    request(application)
      .put(`/api/users/${user_id}/password`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for PUT /api/users/:user_id/password for invalid token', done => {
    request(application)
      .put(`/api/users/${user_id}/password`)
      .send({
        old_password: "Passord123",
        new_password: "PASSord123"
      })
      .set('Authorization', `Bearer ${1000}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/users', done => {
    request(application)
      .put(`/api/users/${user_id}/password`)
      .send({
        old_password: "Passord123",
        new_password: "PASSord123"
      })
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Find all region subscriptions for a user', () => {
  test('400 status code for GET /api/users/:user_id/region_subscriptions without token', done => {
    return request(application)
      .get(`/api/users/${user_id}/region_subscriptions`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for GET /api/users/:user_id/region_subscriptions with invalid user_id', done => {
    return request(application)
      .get(`/api/users/NaN/region_subscriptions`)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for GET /api/users/:user_id/region_subscriptions with wrong token', done => {
    return request(application)
      .get(`/api/users/${user_id}/region_subscriptions`)
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/users/:user_id/region_subscriptions', done => {
    return request(application)
      .get(`/api/users/${user_id}/region_subscriptions`)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete a user', () => {
  test('400 status code for DELETE /api/users/:user_id without token', done => {
    return request(application)
      .delete(`/api/users/${user_id}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for DELETE /api/users/:user_id with invalid user_id', done => {
    return request(application)
      .delete(`/api/users/NaN`)
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for DELETE /api/users/:user_id with invalid token', done => {
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

describe('Find all users registered in the system (only admins)', () => {
  test('400 status code for GET /api/users without token', done => {
    request(application)
      .get('/api/users')
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for GET /api/users for non-admins', done => {
    request(application)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/users', done => {
    request(application)
      .get('/api/users')
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

