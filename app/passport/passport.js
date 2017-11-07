var FacebookStrategy = require('passport-facebook').Strategy; // Import Passport-Facebook Package
var TwitterStrategy = require('passport-twitter').Strategy; // Import Passport Twitter Package
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';

module.exports = function (app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false
        }
    }));

    passport.serializeUser(function (user, done) {
        // if (user.active) {
        //     if (user.error) {
        //         token = 'unconfirmed/error';
        //     } else {
        token = jwt.sign({
            username: user.username,
            email: user.email
        }, secret, {
                expiresIn: '24h'
            }
        );
        //     }
        // } else {
        //     token = 'inactive/error'; 
        // }
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: '310132302703073', 
        clientSecret: '2e94e77add384b6e2b2029947c3861b4', 
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            console.log(profile._json.email);
            User.findOne({ email: profile._json.email }).select('username password email').exec(function (err, user) {
                if (err) {
                    done(err);
                } else {
                    if (user && user !== null) {
                        done(null, user);
                    } else {
                        done(err);
                    }
                }
            });
            // done(null, profile);
        }
    ));

    passport.use(new TwitterStrategy({
        consumerKey: 'nAsRdF40TX5fQ7QivmuJGWWSj', 
        consumerSecret: 'WH4MaKulaiPzrBttgS5KlQzanXmZIKZ4hmAlflfwX8jk3WNTwA',
        callbackURL: "http://localhost:8080/auth/twitter/callback", 
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    },
        function (token, tokenSecret, profile, done) {
            console.log(profile);
            console.log(profile.emails[0].value);
            if (profile.emails) {
                User.findOne({ email: profile.emails[0].value }).select('username password email').exec(function (err, user) {
                    if (err) {
                        done(err);
                    } else {
                        if (user && user !== null) {
                            done(null, user);
                        } else {
                            done(err);
                        }
                    }
                });
            } else {
                user = {};
                user.id = 'null';
                user.active = true;
                user.error = true;
                done(null, user);
            }
            // done(null, profile);
        }
    ));


    passport.use(new GoogleStrategy({
        clientID: '852222686887-ld3cnfu1g76lpi0bgrmpbr37css6c3o0.apps.googleusercontent.com', 
        clientSecret: 'j-k8frTBw-6u-De6vPqk3uSI', 
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            console.log(profile.emails[0].value);
            User.findOne({ email: profile.emails[0].value }).select('username password email').exec(function (err, user) {
                if (err) {
                    done(err);
                } else {
                    if (user && user !== null) {
                        done(null, user);
                    } else {
                        done(err);
                    }
                }
            });
            //done(null, profile);
        }
    ));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function (req, res) {
        res.redirect('/facebook/' + token);
    });
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function (req, res) {
        res.redirect('/twitter/' + token);
    });

    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function (req, res) {
        res.redirect('/google/' + token);
    });

    return passport;
};