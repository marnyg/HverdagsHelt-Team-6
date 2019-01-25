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

// ***************** Categories *****************
describe('Find all categories', () => {
  test('200 status code for GET /api/categories', done => {
    return request(application)
      .get('/api/categories')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

let category_id;
describe('Create new category', () => {
  test('400 status code for POST /api/categories without body', done => {
    request(application)
      .post('/api/categories')
      .set('Authorization', `Bearer ${admin_token}`)
      .send()
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for POST /api/categories without valid token', done => {
    request(application)
      .post('/api/categories')
      .set('Authorization', `Bearer ${100}`)
      .send({
        name: 'CategoryTest'
      })
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for POST /api/categories without token', done => {
    request(application)
      .post('/api/categories')
      .send({
        name: 'CategoryTest'
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('200 status code for POST /api/categories', done => {
    request(application)
      .post('/api/categories')
      .send({
        name: 'CategoryTest'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        category_id = response.body.category_id;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('409 status code for POST /api/categories category already exist', done => {
    request(application)
      .post('/api/categories')
      .send({
        name: 'CategoryTest'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
});

describe('Update one in categories', () => {
  test('400 status code for PUT /api/categories/:category_id without body', done => {
    return request(application)
      .put(`/api/categories/${category_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('400 status code for PUT /api/categories/:category_id without valid id', done => {
    return request(application)
      .put(`/api/categories/${'cat'}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for PUT /api/categories/:category_id without valid token', done => {
    return request(application)
      .put(`/api/categories/${category_id}`)
      .send({ name: 'updatedCategoryTest' })
      .set('Authorization', `Bearer ${12345}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for PUT /api/categories/:category_id without token', done => {
    return request(application)
      .put(`/api/categories/${category_id}`)
      .send({ name: 'updatedCategoryTest' })
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('404 status code for PUT /api/categories/:category_id without category_id', done => {
    request(application)
      .delete(`/api/categories/`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
  test('409 status code for PUT /api/categories/:category_id category already exist', done => {
    return request(application)
      .put(`/api/categories/${category_id}`)
      .send({ name: 'Måking' })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for PUT /api/categories/:category_id', done => {
    return request(application)
      .put(`/api/categories/${category_id}`)
      .send({
        name: 'updatedCategoryTest'
      })
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('Delete one in categories', () => {
  test('400 status code for DELETE /api/categories/:category_id with invalid id', done => {
    request(application)
      .delete(`/api/categories/${'Not a number'}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  test('401 status code for DELETE /api/categories/:category_id without valid token', done => {
    request(application)
      .delete(`/api/categories/${category_id}`)
      .set('Authorization', `Bearer ${0}`)
      .then(response => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  test('403 status code for DELETE /api/categories/:category_id without token', done => {
    request(application)
      .delete(`/api/categories/${category_id}`)
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
  test('409 status code for DELETE /api/categories/:category_id when id is connected to cases', done => {
    request(application)
      .delete(`/api/categories/${2}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });
  test('200 status code for DELETE /api/categories/:category_id', done => {
    request(application)
      .delete(`/api/categories/${category_id}`)
      .set('Authorization', `Bearer ${admin_token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
