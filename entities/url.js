const dns = require('dns');

class Url {
  /**
   * Should call createUrl() instead of calling constructor
   * directly. createUrl() will validate the provided string
   * and return Url object if it is a valid url.
   * @param str - valid url string
   */
  constructor(str) {
    this.url = Url.removeLastSlash(str);
  }

  static removeLastSlash(url) {
    if (url.charAt(url.length - 1) === '/') {
      return url.slice(0, -1);
    } else {
      return url;
    }
  }

  static async createUrl(str) {
    if (!Url.isValidFormat(str)) {
      throw new Error('invalid url format');
    }
    const domain = Url.getDomain(str);
    try {
      const isValidDomain = await Url.checkValidDomain(domain);
      if (isValidDomain) {
        return new Url(str);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static isValidFormat(str) {
    const urlFormat = /https?:\/\/(\w{1,10}\.)?([\w-]{1,50})\.(\w{1,10})(\/[\w-]+)?\/?/;
    return urlFormat.test(str);
  }

  static getDomain(str) {
    const domainFormat = /https?:\/\/([^\/]+)/;
    return (str.match(domainFormat)[1]);
  }

  static checkValidDomain(domain) {
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

module.exports = Url;