const express = require('express');

const mongoose = require('mongoose');
const Registration = mongoose.model('Registration');

const path = require('path');
const auth = require('http-auth');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

const { check, validationResult } = require('express-validator');

const router = express.Router();
router.get('/', (req, res) => {
    res.render('home', { title: 'HAPEE Home', location: 'home' });
});

router.get('/request/needs/200', ((req,res) => {
    let num = Math.floor(Math.random() * 100);
    if ( num %2 == 0 ) {
        res.status(200).send(
            '{"status": 200, "int": ' + num + ', "rewritten": false, "headers": [ ' +
            JSON.stringify(req.headers) + " ] }\n"
        )
    } else {
        res.status(400)
        .setHeader("X-Reason", "No Reason")
        .send(
            '{"status": 400, "int": ' + num + ', "rewritten": false, "headers": [ ' +
            JSON.stringify(req.headers) + " ] }\n"
        )
    }
}));

router.get('/rewrite/request/needs/200', ((req,res) => {
    res.status(200).send(
        '{"status": 200, "int": 101, "rewritten": true, "headers": [ ' +
        JSON.stringify(req.headers) + " ] }\n"
    )
}));

router.get('/about', (req, res) => {
    let data = {xfp: req.get("X-Forwarded-proto"), xff: req.get("X-Forwarded-For"), cluster_id: req.get("X-Cluster-Id"),
               hostname: req.get("X-Hostname"), host: req.get("Host"), servers: req.get("X-Servers"), hapees: req.get("X-Hapees"),
               local: req.connection.localAddress + ":" + req.connection.localPort,
               remote: req.connection.remoteAddress + ":" + req.connection.remotePort}
    res.render('about', { title: 'About Us', location: 'about', data: data});
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registration Form', location: 'register' });
});

router.post('/register', 
    [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
  ],
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const registration = new Registration(req.body);
        registration.save()
            .then(() => {
                res.render('registered', { title: 'Registration Form', location: 'register', data: req.body });
            })
            .catch((err) => {
                console.log(err);
                res.render('form', {
                    title: 'Registration form',
                    data: req.body,
                });
            })
        
    } else {
        res.render('form', {
            title: 'Registration form',
            errors: errors.array(),
            data: req.body,
        });
    }
});

router.get('/coffee', (req, res) => {
    res.render('coffee', {title: 'Coffee is Great', location: 'coffee' });
});

router.get('/tea', (req,res) => {
    if ( req.get("X-HAPEE-NoCoffee") == "true" ) {
        res.render('tea', {title: 'No Coffee, TEA!', location: 'tea' });
    } else {
        res.render('tea', {title: 'Tea is BEST', location: 'tea'});
    }
});

router.get('/login', (req, res) => {
    res.render('login', {title: 'login', location: 'login' });
});

router.get('/sysadmin', (req, res) => {
    if ( req.get("X-HAPEE-Auth") != "HAPEE-4-THE-WIN" ) {
        res.status(401).send("Access DENIED!")
    } else {
        res.set('Cache-control', 'no-store')
        res.render('sysadmin', { title: 'Welcome Administrator', location: 'sysadmin' });
    }
});

router.get('/sysadmin/registrations', (req, res) => {
    if ( req.get("X-HAPEE-Auth") != "HAPEE-4-THE-WIN" ) {
        res.status(401).send("Access DENIED!")
    } else {
        Registration.find()
        .then((registrations) => {
            res.set('Cache-control', 'no-store')
            res.render('registrations', { title: 'Listing registrations', location: 'sysadmin', registrations });
        })
        .catch(() => { res.send('Sorry! Something went wrong.'); });
    }
  });

module.exports = router;
