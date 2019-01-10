//
const request = require('supertest');
const server = require('../src/server.js');

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});
/*
// close the server after each test
afterAll(() => {
    server.close();
    console.log('server closed!');
});*/

describe('/api/cases', () => {
    test('GET /api/cases', async () => {
        const response = await request(server).get('/api/cases');
        expect(response.status).toEqual(200);
    });
});