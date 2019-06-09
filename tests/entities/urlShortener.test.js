const UrlShortener = require('../../entities/urlShortener');

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


