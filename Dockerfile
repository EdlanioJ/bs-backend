FROM node:16.14.2-alpine3.15

RUN apk add --no-cache bash

RUN yarn global add @nestjs/cli@8.2.5

USER node

WORKDIR /home/node/app

COPY . .