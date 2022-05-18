#!/bin/sh

if [ ! -f ".env" ]; then
   cp .env.example .env
fi

yarn install

yarn start:dev