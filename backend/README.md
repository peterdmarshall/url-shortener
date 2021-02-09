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


# Rate Limiting
Rate limiting is implemented for each api key using redis.
This will prevent abuse of the developer api key by malicious users.

A fixed window rate limiting strategy is implemented. Requests are limited per second,
minute, and hour.


# Caching
A caching strategy to optimize read times for short urls is implemented using
redis. The cache expiry policy is set so that short urls will be cached for 24
hours after they are last accessed.



