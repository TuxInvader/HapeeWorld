#!/bin/bash

mkdir -p /data/db
mongod &

source /usr/local/nvm/nvm.sh
cd "/usr/app/${APP_NAME}"

if [ "$NODE_ENV" = "production" ]
then
  pm2 start "/usr/app/${APP_NAME}/start.js"
  pm2 logs
else
  npm run watch
fi


