const dns = require('dns');
const ShortenUrls = require('../dbModels/shortenUrls');

class UrlShortener {
  static async createKeyFromUrl(str) {
    const isValid = await UrlShortener._isValidUrl(str);
    if (isValid) {
      const url = UrlShortener._removeLastSlash(str);
      const existingKey = await ShortenUrls.findKeyByUrl(url);

      if (existingKey !== null) {
        return existingKey;
      } else {
        return await ShortenUrls.add(url);
      }
    } else {
      throw new UrlShortenerError('Invalid URL');
    }
  }

  static async retrieveUrlFromKey(key) {
    if (this._isValidKey(key)) {
      const url = await ShortenUrls.retrieve(key);
      if (url) {
        return url;
      } else {
        throw new UrlShortenerError('URL not found.');
      }
    } else {
      throw new UrlShortenerError('URL not found.');
    }
  }

  static _isValidKey(key) {
    return /\d{1,10}/.test(key);
  }

  static _removeLastSlash(url) {
    if (url.charAt(url.length - 1) === '/') {
      return url.slice(0, -1);
    } else {
      return url;
    }
  }

  static async _isValidUrl(str) {
    if (!UrlShortener._isValidFormat(str)) {
      return false;
    }
    const domain = UrlShortener._getDomain(str);
    return (await UrlShortener._isValidDomain(domain));
  }

  static _isValidFormat(str) {
    const urlFormat = /https?:\/\/(\w{1,10}\.)?([\w-]{1,50})\.(\w{1,10})(\/[\w-]+)?\/?/;
    return urlFormat.test(str);
  }

  static _getDomain(str) {
    const domainFormat = /https?:\/\/([^\/]+)/;
    return (str.match(domainFormat)[1]);
  }

  static async _isValidDomain(domain) {
    try {
      return await UrlShortener._dnsLookup(domain);
    } catch (err) {
      return false;
    }
  }

  static _dnsLookup(domain) {
    return new Promise((resolve, reject) => {
      dns.lookup(domain, err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      })
    });
  }
}

class UrlShortenerError extends Error {
  constructor(params) {
    super(params);
  }
}

module.exports = {UrlShortener, UrlShortenerError};