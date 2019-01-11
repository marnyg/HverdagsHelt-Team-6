//
import { application } from '../src/server';
import request from 'supertest';

let loginToken=null;
describe('POST /api/login', async () => {
  let data = {
    email:"test@gmail.com",
    password:"password123"
  };
  test('200 status code for POST', function(done) {
    request(application)
      .post('/api/login')
      .send(data)
      .then(response => {
        loginToken = response.body.token;
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

if (loginToken!==null) loginToken = "Bearer "+loginToken;

describe('GET /api/users', () => {
  test('200 status code for GET', done => {
    request(application)
      .get('/api/users')
      .setHeader({Authorization: loginToken})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

});

describe('GET /api/cases', () => {
  test('200 status code for GET', done => {
    request(application)
      .get('/api/cases')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('GET method returns a list', done => {
    request(application)
      .get('/api/cases')
      .then(response => {
        expect(response.body).toBeInstanceOf(Array);
        done();
      });
  });
});

let caseid;
describe('POST /api/cases', async () => {
  let data = {
    title: 'Glatt vei',
    description: 'Veldig glatt vei i Oslo',
    lat: 63.42846459999999,
    lon: 10.388523800000002,
    region_id: 1,
    user_id: 1,
    category_id: 1,
    status_id: 1
  };
  test('200 status code for POST', function(done) {
    request(application)
      .post('/api/cases')
      .send(data)
      .then(response => {
        //console.log(response.body.case_id);
        caseid = response.body.case_id;
        expect(response.statusCode).toBe(200);
        expect(caseid).toBeGreaterThan(10);
        done();
      });
  });
});

describe('GET /api/cases/user_cases/{user_id}', () => {
  test('200 status code for GET case with case_id = 1', done => {
    request(application)
      .get('/api/cases/user_cases/1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/:case_id/status_comments', () => {
  test('200 status code for GET comments for case_id = 1', done => {
    request(application)
      .get('/api/cases/1/status_comments')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/:case_id/status_comments', () => {
  let data = {
    comment: "Venter på deler",
    status_id: 2,
    user_id: 1
  };
  test('200 status code for POST comments for case_id = 1', done => {
    request(application)
      .put('/api/cases/1/status_comments')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/{case_id}', () => {
  test('200 status code for GET with case id = ' + caseid, done => {
    request(application)
      .get('/api/cases/user_cases/' + caseid)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('PUT /api/cases/{case_id}', () => {
  let data = {
    title: 'Istapper',
    description: 'Det er såpeglatt',
    lat: 63.42846459999999,
    lon: 10.388523800000002,
    region_id: 1,
    user_id: 1,
    category_id: 1,
    status_id: 1
  };
  test('200 status code for PUT with case_id = ' + caseid, done => {
    request(application)
      .put('/api/cases/' + caseid)
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('DELETE /api/cases/{case_id}', () => {
  test('200 status code for GET with case_id = ' + caseid, done => {
    request(application)
      .delete('/api/cases/' + caseid)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('POST /api/cases/{case_id}/subscribe', () => {
  let data = {
    user_id: 1,
    notify_by_email: true,
    is_up_to_date: true
  };
  test('200 status code for POST with case id = 1', done => {
    request(application)
      .post('/api/cases/1/subscribe')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('DELETE /api/cases/{case_id}/subscribe', () => {
  let data = {
    user_id: 1
  };
  test('200 status code for DELETE with case id = 1', done => {
    request(application)
      .delete('/api/cases/1/subscribe')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/subscriptions/:user_id', () => {
  test('200 status code for GET with user id = 1', done => {
    request(application)
      .get('/api/cases/subscriptions/1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/cases/region_cases/{county_name}/{region_name}', () => {
  test('200 status code for GET Trøndelag/Trondheim', done => {
    request(application)
      .get('/api/cases/region_cases/Trøndelag/Trondheim')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/statuses', () => {
  test('200 status code for GET', done => {
    request(application)
      .get('/api/statuses')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('POST /api/statuses', () => {
  let data = {
    name: "Ugyldig"
  };
  test('200 status code for POST', done => {
    request(application)
      .post('/api/statuses')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET /api/roles', () => {
  test('200 status code for GET', done => {
    request(application)
      .get('/api/roles')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('POST /api/roles/', () => {
  let data = {
    name: "Test bruker"
  };
  test('200 status code', done => {
    request(application)
      .put('/api/statuses')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('PUT /api/roles/:role_id', () => {
  let data = {
    name: "Test bruker"
  };
  test('200 status code', done => {
    request(application)
      .put('/api/statuses')
      .send(data)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
// ***************************** USERS **************************************

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

let user_id;
describe('POST /api/users', async () => {
  let data = {
    firstname: 'Bob',
    lastname: 'Larseen',
    tlf: 40099200,
    email: 'bobjensen@helt.com',
    password: '123999',
    region_id: 1
  };
  test('200 status code for POST user', function(done) {
    request(application)
      .post('/api/users')
      .send(data)
      .then(response => {
        user_id = response.body.user_id;
        expect(response.statusCode).toBe(200);
        expect(user_id).toBeGreaterThan(0);
        done();
      });
  });
});

describe('GET /api/users/{user_id}', () => {
  test('200 status code for GET user with user_id = ' + user_id, done => {
    request(application)
      .get('/api/users/' + user_id)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('DELETE /api/users/{user_id}', () => {
  test('200 status code for DELETE with user_id = ' + user_id, done => {
    request(application)
      .delete('/api/users/' + user_id)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

