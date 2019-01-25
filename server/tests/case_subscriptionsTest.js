import { application } from '../src/server';
import request from 'supertest';

let admin_token;
let admin_id;
let user_token;
let user_id;

let case_id = 1;
// ***************** Login admin og user *************
beforeAll(done => {
  request(application)
    .post('/api/login')
    .send({
      email: 'admin@admin.com',
      password: 'passord123'
    })
    .end((err, res) => {
      admin_token = res.body.token;
      admin_id = res.body.user.user_id;
    });
  request(application)
    .post('/api/login')
    .send({
      email: 'gunnar.gunnarson@gmail.com',
      password: 'passord123'
    })
    .end((err, res) => {
      user_token = res.body.token;
      user_id = res.body.user.user_id;
      done();
    });
});

// ***************** case_subscriptions *****************
describe('Find all case_subscriptions for a private user', () => {
  test('400 status code for GET /api/cases/subscriptions/:user_id without valid id', done => {
    return request(application)
      .get(`/api/cases/subscriptions/to`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for GET /api/cases/subscriptions/:user_id without valid token', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}`)
      .set('Authorization', `Bearer ${10000}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for GET /api/cases/subscriptions/:user_id without token', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/cases/subscriptions/:user_id', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Find all cases a private user has subscriptions to', () => {
  test('400 status code for GET /api/cases/subscriptions/:user_id/cases without valid id', done => {
    return request(application)
      .get(`/api/cases/subscriptions/to/cases`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for GET /api/cases/subscriptions/:user_id/cases without valid token', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}/cases`)
      .set('Authorization', `Bearer ${10000}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for GET /api/cases/subscriptions/:user_id/cases without token', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}/cases`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/cases/subscriptions/:user_id/cases', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}/cases`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let case_subscription_id;
describe('Create a subscription to a case', () => {
  test('400 status code for POST /api/cases/:case_id/subscribe without valid id', done => {
    request(application)
      .post('/api/cases/to/subscribe')
      .send({
        user_id: user_id,
        notify_by_email: 1,
        is_up_to_date: 0
      })
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for POST /api/cases/:case_id/subscribe without body', done => {
    request(application)
      .post(`/api/cases/${case_id}/subscribe`)
      .send({})
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for POST /api/cases/:case_id/subscribe without valid token', done => {
    request(application)
      .post(`/api/cases/${case_id}/subscribe`)
      .send({
        user_id: user_id,
        notify_by_email: 1,
        is_up_to_date: 0
      })
      .set('Authorization', `Bearer ${10000}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for POST /api/cases/:case_id/subscribe without token', done => {
    request(application)
      .post(`/api/cases/${case_id}/subscribe`)
      .send({
        user_id: user_id,
        notify_by_email: 1,
        is_up_to_date: 0
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/cases/:case_id/subscribe', done => {
    request(application)
      .post(`/api/cases/${case_id}/subscribe`)
      .send({
        user_id: user_id,
        notify_by_email: true,
        is_up_to_date: false
      })
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        case_subscription_id = response.body.case_subscription_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('409 status code for POST /api/cases/:case_id/subscribe to a case already subscribed to', done => {
    request(application)
      .post(`/api/cases/${case_id}/subscribe`)
      .send({
        user_id: user_id,
        notify_by_email: true,
        is_up_to_date: false
      })
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        case_subscription_id = response.body.case_subscription_id;
        expect(response.statusCode).toBe(409);
        done();
      });
  });
});

let invalid = "NaN";
describe('Update a case_subscriptions', () => {
  test('400 status code for PUT /api/cases/:case_id/subscribe without valid case_id', done => {
    return request(application)
      .put(`/api/cases/${invalid}/subscribe`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for PUT /api/cases/:case_id/subscribe without body', done => {
    return request(application)
      .put(`/api/cases/${case_id}/subscribe`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for PUT /api/cases/:case_id/subscribe without valid token', done => {
    return request(application)
      .put(`/api/cases/${case_id}/subscribe`)
      .send({
        user_id: user_id,
        notify_by_email: false,
        is_up_to_date: false
      })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for PUT /api/cases/:case_id/subscribe without token', done => {
    return request(application)
      .put(`/api/cases/${case_id}/subscribe`)
      .send({
        user_id: user_id,
        notify_by_email: false,
        is_up_to_date: false
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/cases/:case_id/subscribe', done => {
    return request(application)
      .put(`/api/cases/${case_id}/subscribe`)
      .send({
        user_id: user_id,
        notify_by_email: false,
        is_up_to_date: false
      })
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete a case_subscriptions', () => {
  test('400 status code for DELETE /api/cases/:case_id/subscribe/:user_id with invalid id', done => {
    request(application)
      .delete(`/api/cases/case_id/subscribe/user_id`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for DELETE /api/cases/:case_id/subscribe/:user_id without valid token', done => {
    request(application)
      .delete(`/api/cases/${case_id}/subscribe/${user_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for DELETE /api/cases/:case_id/subscribe/:user_id without token', done => {
    request(application)
      .delete(`/api/cases/${case_id}/subscribe/${user_id}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for DELETE /api/cases/:case_id/subscribe/:user_id', done => {
    request(application)
      .delete(`/api/cases/${case_id}/subscribe/${user_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Find all cases where a user is not up to date', () => {
  test('400 status code for GET /api/cases/subscriptions/:user_id/cases/is_up_to_date without valid id', done => {
    return request(application)
      .get(`/api/cases/subscriptions/notvalid/cases/is_up_to_date`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for GET /api/cases/subscriptions/:user_id/cases/is_up_to_date without valid token', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}/cases/is_up_to_date`)
      .set('Authorization', `Bearer ${10000}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for GET /api/cases/subscriptions/:user_id/cases/is_up_to_date without token', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}/cases/is_up_to_date`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for GET /api/cases/subscriptions/:user_id/cases/is_up_to_date', done => {
    return request(application)
      .get(`/api/cases/subscriptions/${user_id}/cases/is_up_to_date`)
      .set('Authorization', `Bearer ${user_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
