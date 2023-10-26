#!/bin/bash

mkdir -p /data/db
mongod &

htpasswd -bc "/usr/app/${APP_NAME}/users.htpasswd" "${API_ACCESS_USER}" "${API_ACCESS_PASS}"

source /usr/local/nvm/nvm.sh
cd "/usr/app/${APP_NAME}"

if [ "$NODE_ENV" = "production" ]
then
  pm2 start start.js
  pm2 logs
else
    npm run watch
fi
