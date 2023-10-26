const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
app.use('/', routes);
app.use(express.static('assets'));

module.exports = app;