const request = require('supertest');
const app = require('../app.js');

test('testing hello API', () => {
  return request(app).get('/api/hello').then(response => {
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({greeting: 'hello API'});
  })
});