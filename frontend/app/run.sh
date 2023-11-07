#!/bin/bash

echo "${DATABASE}" | grep localhost > /dev/null
if [ "$?" -eq 0 ]
then
  mkdir -p /data/db
  mongod &
fi

source /usr/local/nvm/nvm.sh
cd "/usr/app/${APP_NAME}"

if [ "$NODE_ENV" = "production" ]
then
  pm2 start "/usr/app/${APP_NAME}/start.js"
  pm2 logs
else
  npm run watch
fi


