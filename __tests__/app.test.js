const request = require('supertest');
const app = require('../app.js');

/* Don't connect DB for this test.
 * Connecting to DB without closing the connection after test
 * will keep test running. (When running only this test file.
 * This problem doesn't seem to happen when running ALL tests.)
 * So, mock with noop if don't need to use db.
 */
jest.mock('../dbHelper');

test('testing hello API', () => {
  return request(app).get('/api/hello').then(response => {
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({greeting: 'hello API'});
  })
});