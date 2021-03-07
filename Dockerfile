FROM node:11 AS builder

WORKDIR /app

COPY src /app/src
COPY angular.json package.json yarn.lock ts*.json /app/

RUN yarn install --production=false
RUN yarn build:production

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY cfg/nginx-default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8081
ENTRYPOINT exec /usr/sbin/nginx -g "daemon off;"
