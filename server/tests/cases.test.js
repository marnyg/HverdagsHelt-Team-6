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