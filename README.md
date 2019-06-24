# API Project: URL Shortener Microservice
[![Build Status](https://img.shields.io/travis/com/min49/url-shortener.svg)](https://travis-ci.com/min49/url-shortener)
[![codecov](https://img.shields.io/codecov/c/github/min49/url-shortener.svg)](https://codecov.io/gh/min49/url-shortener)

### User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":8}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"Invalid URL"}`. *HINT*: to be sure that the submitted url points to a valid site you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original link.


#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.freecodecamp.org

#### Usage:

[this_project_url]/api/shorturl/5

#### Will redirect to:

https://www.freecodecamp.org