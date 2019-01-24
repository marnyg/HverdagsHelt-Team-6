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

// ***************** statuses *****************
describe('Find all statuses', () => {
  test('200 status code for GET /api/statuses', done => {
    return request(application)
      .get('/api/statuses')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let status_id;
describe('Create new status', () => {
  test('400 status code for POST /api/statuses without body', done => {
    request(application)
      .post('/api/statuses')
      .set('Authorization', `Bearer ${admin_token}`)
      .send()
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for POST /api/statuses without valid token', done => {
    request(application)
      .post('/api/statuses')
      .send({
        name: 'Ny status'
      })
      .set('Authorization', `Bearer ${100}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for POST /api/statuses without token', done => {
    request(application)
      .post('/api/statuses')
      .send({
        name: 'Ny status'
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/statuses', done => {
    request(application)
      .post('/api/statuses')
      .send({
        name: 'Ny status'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        status_id = response.body.status_id;
        console.log(status_id);
        expect(response.statusCode).toBe(200);
        done();
      });
  });
    test('409 status code for POST /api/statuses if status exists', done => {
        request(application)
            .post('/api/statuses')
            .send({
                name: 'Ny status'
            })
            .set('Authorization', `Bearer ${admin_token}`)
            .then(response => {
                expect(response.statusCode).toBe(409);
                done();
            });
    });
});

describe('Update one in statuses', () => {
  test('400 status code for PUT /api/statuses/:status_id without body and token', done => {
    return request(application)
      .put(`/api/statuses/${status_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for PUT /api/statuses/:status_id with invalid status_id', done => {
    return request(application)
      .put(`/api/statuses/NaN`)
      .send({
        name: 'Ny status'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for PUT /api/statuses/:status_id without valid token', done => {
    return request(application)
      .put(`/api/statuses/${status_id}`)
      .send({
        name: 'Ny status'
      })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for PUT /api/statuses/:status_id without token', done => {
    return request(application)
      .put(`/api/statuses/${status_id}`)
      .send({
        name: 'Ny status'
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/statuses/:status_id', done => {
    return request(application)
      .put(`/api/statuses/${status_id}`)
      .send({
        name: 'Ny status'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one in statuses', () => {
  test('400 status code for DELETE /api/statuses/:status_id with invalid id', done => {
    request(application)
      .delete(`/api/statuses/NaN`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for DELETE /api/statuses/:status_id without valid token', done => {
    request(application)
      .delete(`/api/statuses/${status_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for DELETE /api/statuses/:status_id without token', done => {
    request(application)
      .delete(`/api/statuses/${status_id}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('404 status code for DELETE /api/statuses/:status_id} without status_id', done => {
    request(application)
      .delete(`/api/statuses`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('409 status code for DELETE /api/statuses/:status_id when id is connected to cases', done => {
    request(application)
      .delete(`/api/statuses/1`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for DELETE /api/statuses/:status_id', done => {
    request(application)
      .delete(`/api/statuses/${status_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
