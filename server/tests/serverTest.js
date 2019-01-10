//
import { application } from '../src/server';
import request from 'supertest';

describe('/api/cases', () => {
    test('It should response the GET method', (done) => {
        request(application).get('/api/cases').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});