FROM node:12.13-alpine as builder

WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN yarn install
COPY . /usr/src/app
RUN yarn build

FROM node:12.13-alpine
RUN yarn global add serve
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build .
EXPOSE 3000
CMD ["serve", "-p", "3000", "-s", "."]


