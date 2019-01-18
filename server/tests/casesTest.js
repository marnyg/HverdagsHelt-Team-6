import { application } from '../src/server';
import request from 'supertest';

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
                expect(caseid).toBeGreaterThan(0);
                done();
            });
    });
});
