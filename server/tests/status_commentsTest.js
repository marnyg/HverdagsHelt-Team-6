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

let case_id = 1;

// ***************** status_comments *****************
describe('Find all status_comments for a case', () => {
  test('200 status code for GET /api/cases/:case_id/status_comments', done => {
    return request(application)
      .get(`/api/cases/${case_id}/status_comments`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let status_comment_id;
describe('Create new status_comment', () => {
  test('400 status code for POST /api/status_comments without body', done => {
    request(application)
      .post(`/api/cases/${case_id}/status_comments`)
      .send()
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for POST /api/status_comments without valid token', done => {
    request(application)
      .post(`/api/cases/${case_id}/status_comments`)
      .send({
        comment: 'Takk for din henvendelse',
        status_id: 2,
        user_id: 7
      })
      .set('Authorization', `Bearer ${100}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/status_comments', done => {
    request(application)
      .post(`/api/cases/${case_id}/status_comments`)
      .send({
        comment: 'Takk for din henvendelse',
        status_id: 2,
        user_id: 7
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        status_comment_id = response.body.status_comment_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Update one in status_comments', () => {
  test('400 status code for PUT /api/status_comments/:status_comment_id without body', done => {
    return request(application)
      .put(`/api/cases/${case_id}/status_comments/${status_comment_id}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for PUT /api/status_comments/:status_comment_id without valid token', done => {
    return request(application)
      .put(`/api/cases/${case_id}/status_comments/${status_comment_id}`)
      .send({
        comment: 'Takk takk',
        status_id: 3,
        user_id: 7
      })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for PUT /api/status_comments/:status_comment_id', done => {
    return request(application)
      .put(`/api/cases/${case_id}/status_comments/${status_comment_id}`)
      .send({
        comment: 'Takk for hjelpen',
        status_id: 3,
        user_id: 7
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one in status_comments', () => {
  test('400 status code for DELETE /api/status_comments/:status_comment_id with invalid id', done => {
    request(application)
      .delete(`/api/cases/${case_id}/status_comments/${'NotAnID'}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('403 status code for DELETE /api/status_comments/:status_comment_id without valid token', done => {
    request(application)
      .delete(`/api/cases/${case_id}/status_comments/${status_comment_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('404 status code for DELETE /api/status_comments/:status_comment_id} without status_comment_id', done => {
    request(application)
      .delete(`/api/cases/${case_id}/status_comments/`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('200 status code for DELETE /api/status_comments/:status_comment_id', done => {
    request(application)
      .delete(`/api/cases/${case_id}/status_comments/${status_comment_id}`)
      .send({
        user_id: 7
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
