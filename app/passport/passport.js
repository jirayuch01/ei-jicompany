var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';

module.exports = function (app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));
    passport.serializeUser(function (user, done) {
        if (user.active) {
            if (user.error) {
                token = 'unconfirmed/error';
            } else {
                token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
            }
        } else {
            token = 'inactive/error';
        }
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    return passport;
};