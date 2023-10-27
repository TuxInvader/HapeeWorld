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
    const items = Object.keys(req.query).includes("items") ? req.query.items : 1;
    const live = Object.keys(req.query).includes("live") ? req.query.live : "false"
    if ( items > 10 ) {
        res.status(422).send("422 - Unprocessable request error. The maximum blog entries you may request is 10.")
    } else {
        if (live == "true") {
            scraper.getBlogs(items).then((data) => { res.send(data) });
        } else {
            const blogfile = path.join(__dirname, "../static/blogs.json");
            scraper.parseStatic(blogfile, items, res);
        }
    }
}));

router.get('/v1/releases', basic.check((req, res) => {
    const items = Object.keys(req.query).includes("items") ? req.query.items : 1;
    const live = Object.keys(req.query).includes("live") ? req.query.live : "false"
    if ( items > 10) {
        res.status(422).send("422 - Unprocessable request error. The maximum release entries you may request is 10.")
    } else {
        if (live == "true") {
            scraper.getReleases(items).then((data) => { res.send(data) });
        } else {
            const relfile = path.join(__dirname, "../static/releases.json");
            scraper.parseStatic(relfile, items, res);
        }
    }
}));

router.get('/v1/ping', basic.check((req, res) => {
    res.status(200).send('pong\n');
}));

module.exports = router;
