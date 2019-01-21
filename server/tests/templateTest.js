import { application } from '../src/server';
import request from 'supertest';

// Template for test-cases

// Replace all modules with module-name (in plural)
// Replace all module with module-name (in singular)
// Replace module_id with correct id

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

// ***************** Modules *****************
describe('Find all modules', () => {
  test('200 status code for GET /api/modules', done => {
    return request(application)
      .get('/api/modules')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let module_id;
describe('Create new module', () => {
  test('400 status code for POST /api/modules without body', done => {
    request(application)
      .post('/api/modules')
      .send()
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for POST /api/modules without valid token', done => {
    request(application)
      .post('/api/modules')
      .send({body})
      .set('Authorization', `Bearer ${100}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/modules', done => {
    request(application)
      .post('/api/modules')
      .send({
        key: 'Value'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        module_id = response.body.module_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Find one in modules', () => {
  test('200 status code for GET /api/modules/:module_id', done => {
    request(application)
      .get(`/api/modules/${module_id}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('404 status code for GET /api/modules/:module_id with invalid name', done => {
    request(application)
      .get('/api/modules/Heipådeg')
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
});

describe('Update one in modules', () => {
  test('400 status code for PUT /api/modules/:module_id without body', done => {
    return request(application)
      .put(`/api/modules/${module_id}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for PUT /api/modules/:module_id without valid token', done => {
    return request(application)
      .put(`/api/modules/${module_id}`)
      .send({ key: 'Value' })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/modules/:module_id', done => {
    return request(application)
      .put(`/api/modules/${module_id}`)
      .send({
        key: 'Vaule'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one in modules', () => {
  test('400 status code for DELETE /api/modules/:module_id with invalid id', done => {
    request(application)
      .delete(`/api/modules/${'Not a number'}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for DELETE /api/modules/:module_id without valid token', done => {
    request(application)
      .delete(`/api/modules/${module_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('404 status code for DELETE /api/modules/:module_id} without module_id', done => {
    request(application)
      .delete(`/api/modules`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('409 status code for DELETE /api/modules/:module_id when id is connected to cases', done => {
    request(application)
      .delete(`/api/modules/${module_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for DELETE /api/modules/:module_id', done => {
    request(application)
      .delete(`/api/modules/${module_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
