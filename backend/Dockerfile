FROM ruby:2.7.1-alpine3.12

# Install dependencies
RUN apk update \
 && apk add --no-cache \
    build-base \
    sqlite-dev \
    nodejs \
    postgresql-client \
    postgresql-dev \
    tini \
    git \
    tzdata \
    yarn \
    && addgroup urlmin \
    && adduser -G urlmin -D urlmin

# Set the installation location
WORKDIR /usr/src/app

COPY --chown=urlmin:urlmin  Gemfile* ./
RUN bundle install --deployment --without development:test --clean

COPY --chown=urlmin:urlmin . ./

RUN chown -R urlmin:urlmin /usr/src/app
USER urlmin:urlmin
ENV RAILS_ENV=production RAILS_SERVE_STATIC_FILES=true

EXPOSE 3001
CMD ["bundle", "exec", "rails", "server", "-p", "3001", "-b", "0.0.0.0"]