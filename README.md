## URL Shortener
URL shorteners are useful when posting long and complicated links to social networking sites like twitter,
or when sharing a URL through a physical medium like a flyer where it will be copied by hand.

# API

```GET /s/:short_url```
Returns a 302 redirect to the long url that corresponds to the provided short url.
Returns a 404 Not Found if there is no valid mapping for the short url.

```POST /api/v1/url```
```headers: { API_KEY: VALID_API_KEY }```
```body: { url: URL_TO_SHORTEN }```
Creates a new short url for the provided long url and returns it.
Returns with 403 Unauthorized if the API_KEY is invalid. 
Returns with 429 too many requests if the rate limit has been reached for
the provided API_KEY
