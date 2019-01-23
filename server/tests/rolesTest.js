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

// ***************** Roles *****************
describe('Find all roles', () => {
  test('401 status code for GET /api/roles without valid token', done => {
    return request(application)
      .get(`/api/roles`)
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for GET /api/roles without token', done => {
    return request(application)
      .get(`/api/roles`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/roles', done => {
    return request(application)
      .get(`/api/roles`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let role_id;
describe('Create new role', () => {
  test('400 status code for POST /api/roles without body', done => {
    request(application)
      .post('/api/roles')
      .send({})
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for POST /api/roles without valid token', done => {
    request(application)
      .post('/api/roles')
      .send({
        name: 'Role name',
        access_level: 10
      })
      .set('Authorization', `Bearer ${100}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for POST /api/roles without token', done => {
    request(application)
      .post('/api/roles')
      .send({
        name: 'Role name',
        access_level: 10
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('409 status code for POST /api/roles when the role exists', done => {
    request(application)
      .post('/api/roles')
      .send({
        name: 'Admin',
        access_level: 1
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for POST /api/roles', done => {
    request(application)
      .post('/api/roles')
      .send({
        name: 'Role name',
        access_level: 10
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        role_id = response.body.role_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Update one in roles', () => {
  test('400 status code for PUT /api/roles/:role_id without body', done => {
    return request(application)
      .put(`/api/roles/${role_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for PUT /api/roles/:role_id without valid role_id', done => {
    return request(application)
      .put(`/api/roles/NaN`)
      .set('Authorization', `Bearer ${admin_token}`)
      .send({
        name: 'New role',
        access_level: 10
      })
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for PUT /api/roles/:role_id without valid token', done => {
    return request(application)
      .put(`/api/roles/${role_id}`)
      .send({
        name: 'New role',
        access_level: 10
      })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for PUT /api/roles/:role_id without token', done => {
    return request(application)
      .put(`/api/roles/${role_id}`)
      .send({
        name: 'New role',
        access_level: 10
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/roles/:role_id', done => {
    return request(application)
      .put(`/api/roles/${role_id}`)
      .send({
        name: 'New role',
        access_level: 10
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one in roles', () => {
  test('400 status code for DELETE /api/roles/:role_id with invalid id', done => {
    request(application)
      .delete(`/api/roles/NaN`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for DELETE /api/roles/:role_id without valid token', done => {
    request(application)
      .delete(`/api/roles/${role_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for DELETE /api/roles/:role_id without token', done => {
    request(application)
      .delete(`/api/roles/${role_id}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('404 status code for DELETE /api/roles/:role_id} without role_id', done => {
    request(application)
      .delete(`/api/roles`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('409 status code for DELETE /api/roles/:role_id when id is connected to cases', done => {
    request(application)
      .delete(`/api/roles/${1}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for DELETE /api/roles/:role_id', done => {
    request(application)
      .delete(`/api/roles/${role_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
