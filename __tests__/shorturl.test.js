/**
 * Test shorturl API (route & controller)
 * Mocked functions at Entities level (entities/urlShortener).
 * So, these tests don't need DB.
 *
 * Other ways to write these tests:
 * 1) Don't mock and use mongodb-memory-server.
 * 2) Mock at dbModel level (dbModels/shortenUrls).
 *
 * Option (1) seems better to me than current tests or option (2).
 * This is done mostly as an exercise in mocking.
 */

jest.mock('../dbHelper');

// Create a mock for urlShortener module, where
// UrlShortener is auto mock, and
// UrlShortenerError is actual (un-mocked) version.
//
// Doesn't want to mock UrlShortenerError because we are checking errorMsg
// in tests and mocking it would replace the UrlShortenerError constructor
// that sets errorMsg with mocked version (resulting in empty error message).
jest.mock('../entities/urlShortener', () => {
  const {UrlShortener} = jest.genMockFromModule('../entities/urlShortener');
  const {UrlShortenerError} = jest.requireActual('../entities/urlShortener');
  return {
    UrlShortener: UrlShortener,
    UrlShortenerError: UrlShortenerError
  }
});

const request = require('supertest');
const app = require('../app');
const {UrlShortener, UrlShortenerError} = require('../entities/urlShortener');

describe('Shorturl API retrieving with key', () => {
  test('Should retrieve url and redirect correctly', async () => {
    const mockStoredUrl = 'http://www.google.com';
    UrlShortener.retrieveUrlFromKey.mockReturnValueOnce(mockStoredUrl);

    const key = '4';
    const res = await request(app).get(`/api/shorturl/${key}`);

    expect(UrlShortener.retrieveUrlFromKey).toBeCalledWith(key);
    expect(res.header.location).toEqual(mockStoredUrl);
  });

  test('Should return json with error message for invalid key', async () => {
    expect.assertions(2);

    const errorMsg = 'Mock Error Msg';
    UrlShortener.retrieveUrlFromKey.mockImplementationOnce(() => {
      throw new UrlShortenerError(errorMsg);
    });

    const invalidKey = 'invK';
    const res = await request(app).get(`/api/shorturl/${invalidKey}`);

    expect(UrlShortener.retrieveUrlFromKey).toBeCalledWith(invalidKey);
    expect(res.body).toEqual({
      error: errorMsg
    });
  });
});

describe('Shorturl API add url', () => {
  test('valid url should add successfully and return json', async () => {
    const mockedKey = 7;
    UrlShortener.createKeyFromUrl.mockReturnValueOnce(mockedKey);

    const urlToAdd = 'http://www.web.com/';
    const res = await request(app).post(`/api/shorturl/new`)
      .send(`url=${urlToAdd}`);

    expect(UrlShortener.createKeyFromUrl).toBeCalledWith(urlToAdd);
    expect(res.body).toEqual({
      'original_url': urlToAdd,
      'short_url': mockedKey
    });
  });

  test('invalid url should return error json', async () => {
    const errorMsg = 'Mock error in add';
    UrlShortener.createKeyFromUrl.mockImplementationOnce(() => {
      throw new UrlShortenerError(errorMsg);
    });

    const invalidUrlToAdd = 'http://www.invalid.com';
    const res = await request(app).post(`/api/shorturl/new`)
      .send(`url=${invalidUrlToAdd}`);

    expect(UrlShortener.createKeyFromUrl).toBeCalledWith(invalidUrlToAdd);
    expect(res.body).toEqual({
      error: errorMsg
    });
  });
});