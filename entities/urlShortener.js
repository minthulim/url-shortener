const dns = require('dns');

class UrlShortener {

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