var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user'); 
var session = require('express-session'); 
var jwt = require('jsonwebtoken'); 
var secret = 'harrypotter';

module.exports = function (app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

    passport.serializeUser(function(user, done) {
        // if (user.active) {
        //     if (user.error) {
        //         token = 'unconfirmed/error';
        //     } else {
                 token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); 
        //     }
        // } else {
        //     token = 'inactive/error'; 
        // }
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: '310132302703073',
        clientSecret: '2e94e77add384b6e2b2029947c3861b4',
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, function (accessToken, refreshToken, profile, done) {
        console.log(profile._json.email);
        User.findOne({ 
            email: profile._json.email 
        }).select('username password email').exec(function (err, user) {
             if (err) done(err);
             if (user && user !== null) {
                 done(null, user);
             } else {
                 done(err);
             }
         });
        done(null, profile);
    }
    ));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
        failureRedirect: '/facebookerror' 
    }), function (req, res) {
        res.redirect('/facebook/' + token);
    });
    
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    
    return passport;
};