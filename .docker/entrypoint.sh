#!/bin/bash

if [ ! -f ".env" ]; then
  cp .env.example .env
fi


yarn install
yarn prisma generate
yarn run start:dev