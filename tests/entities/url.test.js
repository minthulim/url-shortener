const Url = require('../../entities/url');

test('Creating Url with invalid format should throw exception', async () => {
  expect.assertions(2);
  await urlShouldBeInvalid('ssh://test.com/');
  await urlShouldBeInvalid('http://***');
});

async function urlShouldBeInvalid(str) {
  const invalidFormatMsg = 'invalid url format';

  try {
    await Url.createUrl(str)
  } catch (e) {
    expect(e.message).toEqual(invalidFormatMsg);
  }
}

test('Creating Url with invalid domain should throw Error exception', () => {
  const invalidDomain = 'www.not-a-valid-domain-7iuiui232.com';
  const invalidDomainMsg = 'getaddrinfo ENOTFOUND ' + invalidDomain;

  expect.assertions(1);
  return Url.createUrl('http://' + invalidDomain)
    .catch(e => expect(e.message).toBe(invalidDomainMsg));
});


test('Creating Url with valid format and domain should create a Url object', async () => {
  expect.assertions(4);
  await validUrlShouldCreateUrlObject('http://www.google.com');
  await validUrlShouldCreateUrlObject('http://www.amazon.com/extra/route/');
  await validUrlShouldCreateUrlObject('http://microsoft.com/');
  await validUrlShouldCreateUrlObject('http://github.com/site');
});

async function validUrlShouldCreateUrlObject(str) {
  const url = await Url.createUrl(str);
  expect(url).toEqual(new Url(str));
}


