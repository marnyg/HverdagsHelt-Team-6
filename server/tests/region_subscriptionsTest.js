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
  test('400 status code for POST /api/regions/:region_id/subscribe with invalid region_id', done => {
    request(application)
      .post('/api/regions/regionTwo/subscribe')
      .send({
        user_id: 1,
        region_id: 44,
        notify: true
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for POST /api/regions/:region_id/subscribe without valid token', done => {
    request(application)
      .post('/api/regions/44/subscribe')
      .send({
        user_id: 1,
        region_id: 44,
        notify: true
      })
      .set('Authorization', `Bearer ${100}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for POST /api/regions/:region_id/subscribe without token', done => {
    request(application)
      .post('/api/regions/44/subscribe')
      .send({
        user_id: 1,
        region_id: 44,
        notify: true
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
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
  test('400 status code for PUT /api/regions/:region_id/subscribe with invalid region_id', done => {
    return request(application)
      .put(`/api/regions/NaN/subscribe`)
      .send({
        user_id: 6,
        region_id: 44,
        notify: false
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for PUT /api/regions/:region_id/subscribe without valid token', done => {
    return request(application)
      .put(`/api/regions/44/subscribe`)
      .send({
        user_id: 6,
        region_id: 44,
        notify: false
      })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for PUT /api/regions/:region_id/subscribe without token', done => {
    return request(application)
      .put(`/api/regions/44/subscribe`)
      .send({
        user_id: 6,
        region_id: 44,
        notify: false
      })
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
  test('400 status code for DELETE /api/regions/:region_id/subscribe invalid region_id', done => {
    request(application)
      .delete(`/api/regions/NaN/subscribe`)
      .send({
        user_id: 6
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for DELETE /api/regions/:region_id/subscribe invalid user_id', done => {
    request(application)
      .delete(`/api/regions/44/subscribe`)
      .send({
        user_id: 'userSix'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for DELETE /api/regions/:region_id/subscribe without valid token', done => {
    request(application)
      .delete(`/api/regions/44/subscribe`)
      .send({
        user_id: 6
      })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for DELETE /api/regions/:region_id/subscribe without token', done => {
    request(application)
      .delete(`/api/regions/44/subscribe`)
      .send({
        user_id: 6
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for DELETE /api/regions/:region_id/subscribe', done => {
    request(application)
      .delete(`/api/regions/44/subscribe`)
      .send({
        user_id: 6
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
