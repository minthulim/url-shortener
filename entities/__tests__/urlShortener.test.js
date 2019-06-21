const TestDbHelper = require('../../dbModels/__tests__/testUtils/testDbHelper');
const {UrlShortener} = require('../urlShortener');

describe('UrlShortener functions with DB calls', () => {
  const testDbHelper = new TestDbHelper();

  beforeAll(async () => {
    TestDbHelper.setLongTimeoutForDb();
    await testDbHelper.start();
  });

  afterAll(async () => {
    testDbHelper.setOriginalTimeout();
    await testDbHelper.stop();
  });

  beforeEach(() => {
    TestDbHelper.confirmDbIsLocal();
  });

  afterEach(async () => {
    await TestDbHelper.cleanup();
  });

  test('createKeyFromUrl valid new url', async () => {
    expect.assertions(1);

    const key = await UrlShortener.createKeyFromUrl('http://www.google.com/');
    expect(key).toEqual(0);
  });

  test('createKeyFromUrl with two valid, different urls', async () => {
    expect.assertions(2);

    const key1 = await UrlShortener.createKeyFromUrl('https://www.google.com/');
    const key2 = await UrlShortener.createKeyFromUrl('https://www.microsoft.com/');
    expect(key1).toEqual(0);
    expect(key2).toEqual(1);
  });

  test('createKeyFromUrl with one valid url, called twice', async () => {
    expect.assertions(1);

    const inputUrl = 'https://www.google.com/';
    const key1 = await UrlShortener.createKeyFromUrl(inputUrl);
    const key2 = await UrlShortener.createKeyFromUrl(inputUrl);
    expect(key1).toEqual(key2);
  });

  // Testing for exception using async/await
  test('createKeyFromUrl with invalid url', async () => {
    // Without this, test will pass if there is no exception thrown.
    expect.assertions(1);

    try {
      await UrlShortener.createKeyFromUrl('htp://invalid.url');
    } catch (e) {
      expect(e.message).toEqual('Invalid URL');
    }
  });

  // Testing for exception using return
  test('createKeyFromUrl with invalid domain', () => {
    // Without this, test will pass if there is no exception thrown.
    expect.assertions(1);

    return UrlShortener.createKeyFromUrl('http://www.invalid-domain-7830yyln4140.com/')
      .catch(e => expect(e.message).toEqual('Invalid URL'));
  });

  test('retrieveUrlFromKey with non existing key', async () => {
    expect.assertions(1);

    try {
      await UrlShortener.retrieveUrlFromKey(7);
    } catch (e) {
      expect(e.message).toEqual('URL not found.');
    }
  });

  test('can retrieveUrlFromKey after createKeyFromUrl', async () => {
    expect.assertions(1);

    const urlInput = 'http://www.microsoft.com/';
    const expectedUrl = 'http://www.microsoft.com';

    await UrlShortener.createKeyFromUrl('http://www.google.com');
    const key = await UrlShortener.createKeyFromUrl(urlInput);
    const url = await UrlShortener.retrieveUrlFromKey(key);
    expect(url).toEqual(expectedUrl);
  });
});

test('Invalid format URL should be invalid', async () => {
  expect.assertions(2);
  await urlShouldBeInvalid('ssh://test.com/');
  await urlShouldBeInvalid('http://***');
});

async function urlShouldBeInvalid(str) {
  const isValid = await UrlShortener._isValidUrl(str);
  expect(isValid).toEqual(false);

}

test('Url with invalid domain should be invalid', () => {
  const invalidDomain = 'www.not-a-valid-domain-7iuiui232.com';
  expect.assertions(1);
  return expect(UrlShortener._isValidUrl('http://' + invalidDomain)).resolves.toBe(false);
});


test('Url with valid format and domain should be valid', async () => {
  expect.assertions(4);
  await urlShouldBeValid('http://www.google.com');
  await urlShouldBeValid('http://www.amazon.com/extra/route/');
  await urlShouldBeValid('http://microsoft.com/');
  await urlShouldBeValid('http://github.com/site');
});

async function urlShouldBeValid(str) {
  const url = await UrlShortener._isValidUrl(str);
  expect(url).toBe(true);
}


