const {UrlShortener, UrlShortenerError} = require('../entities/urlShortener');

exports.addUrl = async function (req, res) {
  const url = req.body.url;
  try {
    const key = await UrlShortener.createKeyFromUrl(url);
    return res.json({
      'original_url': url,
      'short_url': key
    });
  } catch (e) {
    handleError(e, res);
  }
};

exports.processShortUrl = async function (req, res) {
  const key = req.params.key;
  try {
    const url = await UrlShortener.retrieveUrlFromKey(key);
    return res.redirect(url);
  } catch (e) {
    handleError(e, res);
  }
};

function handleError(e, res) {
  if (e instanceof UrlShortenerError) {
    return res.json({'error': e.message});
  } else {
    return res.json({'error': 'There was an error. Please try again later.'});
  }
}