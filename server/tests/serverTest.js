//
const request = require('supertest');
const server = require('../src/models.js');

beforeAll(async () => {
    // do something before anything else runs
    console.log('Testing endpoints');
});
/*
// close the server after each test
afterAll(() => {
    server.close();
    console.log('server closed!');
});*/

describe('/api/cases', () => {
    test('It should response the GET method', (done) => {
        request(server).get('/api/cases').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});