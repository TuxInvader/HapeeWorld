const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

let setCache = function (req, res, next) {
    if (req.method == 'GET') {
      res.set('Cache-control', 'public, max-age=300')
    } else {
      res.set('Cache-control', 'no-store')
    }
    next()
}
  
app.use(setCache)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use('/', routes);

module.exports = app;