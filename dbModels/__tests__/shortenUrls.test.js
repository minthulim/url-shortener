const TestDbHelper = require('./testUtils/testDbHelper');
const ShortenUrls = require('../shortenUrls');

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

async function createAndAddSampleUrls() {
  const url0 = await new ShortenUrls({
    key: 0,
    url: 'http://www.google.com',
  }).save();
  const url1 = await new ShortenUrls({
    key: 1,
    url: 'http://www.github.com',
  }).save();
  const url2 = await new ShortenUrls({
    key: 2,
    url: 'http://www.freecodecamp.org',
  }).save();
  return {url0, url1, url2};
}

describe('ShortenUrls', () => {
  test('add correctly and can find in db', async () => {
    expect.assertions(3);

    const url = 'http://www.google.com';
    const key = await ShortenUrls.add(url);
    expect(key).toEqual(0);

    const count = await ShortenUrls.estimatedDocumentCount();
    expect(count).toEqual(1);

    const entry = await ShortenUrls.findOne({key});
    expect(entry.url).toEqual(url);
  });

  test('key increments with each add', async () => {
    expect.assertions(1);

    await ShortenUrls.add('http://www.google.com');
    const key = await ShortenUrls.add('http://www.github.com');
    expect(key).toEqual(1);
  });

  test('findKeyByUrl with existing URL return correct key', async () => {
    expect.assertions(1);

    const {url1} = await createAndAddSampleUrls();
    const key = await ShortenUrls.findKeyByUrl(url1.url);
    expect(key).toEqual(url1.key);
  });

  test('findKeyByUrl with non existing URL return null', async () => {
    expect.assertions(1);

    await createAndAddSampleUrls();
    const key = await ShortenUrls.findKeyByUrl('http://www.thisURLdoesnotExists.com');
    expect(key).toBeNull();
  });

  test('retrieve with existing key return correct url', async () => {
    expect.assertions(1);

    const {url2} = await createAndAddSampleUrls();
    const url = await ShortenUrls.retrieve(url2.key);
    expect(url).toEqual(url2.url);
  });

  test('retrieve with non existing key return null', async () => {
    expect.assertions(1);

    await createAndAddSampleUrls();
    const url = await ShortenUrls.retrieve(100);
    expect(url).toBeNull();
  });
});
