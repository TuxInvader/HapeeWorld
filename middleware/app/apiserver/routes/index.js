const express = require('express');

const mongoose = require('mongoose');

const path = require('path');
const auth = require('http-auth');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

const { check, validationResult } = require('express-validator');

const router = express.Router();
const scraper = require('../common/webscraper')

router.get('/v1/blogs', basic.check((req, res) => {
    items = req.query.items ? req.query.items : 4;
    if ( items > 13) {
        res.status(422).send("422 - Unprocessable request error. The maximum blog entries you may request is 13.")
    } else {
        scraper.getBlogs(items).then((data) => { res.send(data) });
    }
}));

router.get('/v1/releases', basic.check((req, res) => {
    items = req.query.items ? req.query.items : 4;
    if ( items > 10) {
        res.status(422).send("422 - Unprocessable request error. The maximum release entries you may request is 10.")
    } else {
        scraper.getReleases(items).then((data) => { res.send(data) });
    }
}));

module.exports = router;
