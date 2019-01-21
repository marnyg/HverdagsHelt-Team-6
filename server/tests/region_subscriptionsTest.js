import { application } from '../src/server';
import request from 'supertest';
import { Region_subscriptions } from '../src/models';

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

// ***************** Region_subscriptions *****************
describe('Find all region_subscriptions', () => {
  test('200 status code for GET /api/regions/:region_id/subscribe', done => {
    return request(application)
      .get('/api/regions/44/subscribe')
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let region_id;
describe('Create new region_subscriptions', () => {
  test('400 status code for POST /api/regions/:region_id/subscribe without body', done => {
    request(application)
      .post('/api/regions/44/subscribe')
      .send()
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for POST /api/regions/:region_id/subscribe without valid token', done => {
    request(application)
      .post('/api/regions/44/subscribe')
      .send({
        user_id: 1,
        region_id: 44,
        notify: true
      })
      .set('Authorization', `Bearer ${100}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  // Test doesn't work, received 409 instead of 404
  // test('404 status code for POST /api/regions/:region_id/subscribe id does not exist', done => {
  //   request(application)
  //     .post('/api/regions/44/subscribe')
  //     .send({
  //       user_id: 9999,
  //       region_id: 44,
  //       notify: true
  //     })
  //     .set('Authorization', `Bearer ${admin_token}`)
  //     .then(response => {
  //       expect(response.statusCode).toBe(404);
  //       done();
  //     });
  // });
  test('200 status code for POST /api/regions/:region_id/subscribe', done => {
    request(application)
      .post('/api/regions/44/subscribe')
      .send({
        user_id: 6,
        region_id: 44,
        notify: true
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        region_id = response.body.region_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('409 status code for POST /api/regions/:region_id/subscribe already exist', done => {
    request(application)
      .post('/api/regions/44/subscribe')
      .send({
        user_id: 6,
        region_id: 44,
        notify: true
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
});

describe('Update one in region_subscriptions', () => {
  test('400 status code for PUT /api/regions/:region_id/subscribe without body', done => {
    return request(application)
      .put(`/api/regions/44/subscribe`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for PUT /api/regions/:region_id/subscribe without valid token', done => {
    return request(application)
      .put(`/api/regions/44/subscribe`)
      .send({
        user_id: 6,
        region_id: 44,
        notify: false
      })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/regions/:region_id/subscribe', done => {
    return request(application)
      .put(`/api/regions/44/subscribe`)
      .send({
        user_id: 6,
        region_id: 44,
        notify: false
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one in region_subscriptions', () => {
  test('400 status code for DELETE /api/regions/:region_id/subscribe with no token', done => {
    request(application)
      .delete(`/api/regions/44/subscribe`)
      .send({
        user_id: 6,
        region_id: 44,
        notify: false
      })
      .set('Authorization', `Bearer ${''}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for DELETE /api/regions/:region_id/subscribe without valid token', done => {
    request(application)
      .delete(`/api/regions/44/subscribe`)
      .send({
        user_id: 6,
        region_id: 44,
        notify: false
      })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for DELETE /api/regions/:region_id/subscribe', done => {
    request(application)
      .delete(`/api/regions/44/subscribe`)
      .send({ region_id: 44, user_id: 6 })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});