const dns = require('dns');
const ShortenUrls = require('../dbModels/shortenUrls');

class UrlShortener {
  static async createKeyFromUrl(str) {
    const isValid = await UrlShortener.isValidUrl(str);
    if (isValid) {
      const url = UrlShortener.removeLastSlash(str);
      const existingKey = await ShortenUrls.findKeyByUrl(url);

      if (existingKey) {
        return existingKey;
      } else {
        return await ShortenUrls.add(url);
      }
    } else {
      throw new Error('Invalid URL');
    }
  }

  static retrieveUrlFromKey(key) {
    if (this.isValidKey(key)) {
      return ShortenUrls.retrieve(key);
    } else {
      throw new Error('URL not found.')
    }
  }

  static isValidKey(key) {
    return /\d{1,10}/.test(key);
  }

  static removeLastSlash(url) {
    if (url.charAt(url.length - 1) === '/') {
      return url.slice(0, -1);
    } else {
      return url;
    }
  }

  static async isValidUrl(str) {
    if (!UrlShortener.isValidFormat(str)) {
      return false;
    }
    const domain = UrlShortener.getDomain(str);
    return (await UrlShortener.isValidDomain(domain));
  }

  static isValidFormat(str) {
    const urlFormat = /https?:\/\/(\w{1,10}\.)?([\w-]{1,50})\.(\w{1,10})(\/[\w-]+)?\/?/;
    return urlFormat.test(str);
  }

  static getDomain(str) {
    const domainFormat = /https?:\/\/([^\/]+)/;
    return (str.match(domainFormat)[1]);
  }

  static async isValidDomain(domain) {
    try {
      return await UrlShortener.dnsLookup(domain);
    } catch (err) {
      return false;
    }
  }

  static dnsLookup(domain) {
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

module.exports = UrlShortener;