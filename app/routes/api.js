var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
module.exports = function (router) {
    var options = {
        auth: {
            api_user: 'meanstackman',
            api_key: 'PAssword123!@#'
        }
    };
    var client = nodemailer.createTransport(sgTransport(options));

    router.post('/users', function (req, res) {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.temporarytoken = jwt.sign({
            username: user.username,
            email: user.email
        }, secret, {
                expiresIn: '24h'
            });
        if (req.body.name === null || req.body.name === '' ||
            req.body.username === null || req.body.username === '' ||
            req.body.password === null || req.body.password === '' ||
            req.body.email === null || req.body.email === '' ||
            req.body.name === null || req.body.name === '') {
            res.json({
                success: false,
                message: 'Ensure username, email, and password were provided'
            });
        } else {
            user.save(function (err) {
                if (err) {
                    if (err.errors !== null) {
                        if (err.errors.name) {
                            res.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else if (err.errors.username) {
                            res.json({
                                success: false,
                                message: err.errors.username.message
                            });
                        } else if (err.errors.password) {
                            res.json({
                                success: false,
                                message: err.errors.password.message
                            });
                        } else if (err.errors.email) {
                            res.json({
                                success: false,
                                message: err.errors.email.message
                            });
                        } else {
                            res.json({
                                success: false,
                                message: err
                            });
                        }
                    } else if (err) {
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({
                                    success: false,
                                    message: 'That username is already taken'
                                });
                            } else if (err.errmsg[61] == "e") {
                                res.json({
                                    success: false,
                                    message: 'That e-mail is already taken'
                                });
                            }
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                } else {
                    var email = {
                        from: 'Ei-Ji Company Staff, jirayu_ch01@hotmail.com',
                        to: user.email,
                        subject: 'Your Activation Link',
                        text: 'Hello ' + user.name +
                        ', thank you for registering at Ei-Ji Company.com. Please click on the following ' +
                        'link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering ' +
                        'at Ei-Ji Company.com. Please click on the link below to complete your activation:<br><br>' +
                        '<a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate/</a>'
                    };
                    client.sendMail(email, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Message sent: ' + info.response);
                            console.log(info);
                            console.log(user.email);
                        }
                    });
                    res.json({
                        success: true,
                        message: 'Account registered! Please check your e-mail for activation link.'
                    });
                }
            });
        }
    });

    router.post('/checkusername', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('username').exec(function (err, user) {
            if (err) {
                throw err;
            } else {
                if (user) {
                    res.json({
                        success: false,
                        message: 'That username is already taken'
                    });
                } else {
                    res.json({
                        success: true,
                        message: 'Valid username'
                    });
                }
            }
        });
    });

    router.post('/checkemail', function (req, res) {
        User.findOne({
            email: req.body.email
        }).select('email').exec(function (err, user) {
            if (err) {
                throw err;
            } else {
                if (user) {
                    res.json({
                        success: false,
                        message: 'That e-mail is already taken'
                    });
                } else {
                    res.json({
                        success: true,
                        message: 'Valid e-mail'
                    });
                }
            }
        });
    });

    router.post('/authenticate', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('email username password').exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({
                    success: false,
                    message: 'Username not found'
                });
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({
                        success: false,
                        message: 'No password provided'
                    });
                }
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Cloud not authenticate password'
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'No password provided'
                    });
                    var token = jwt.sign({
                        username: user.username,
                        email: user.email
                    }, secret, {
                            expiresIn: '24h'
                        }
                    );
                    res.json({
                        success: true,
                        message: 'User authenticated!',
                        token: token
                    });
                }
            }
        });
    });

    router.put('/activate/:token', function (req, res) {
        User.findOne({
            temporarytoken: req.params.token
        }, function (err, user) {
            if (err) {
                // var email = {
                //     from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                //     to: 'gugui3z24@gmail.com',
                //     subject: 'Error Logged',
                //     text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                //     html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                // };
                // client.sendMail(email, function(err, info) {
                //     if (err) {
                //         console.log(err); 
                //     } else {
                //         console.log(info);
                //         console.log(user.email); 
                //     }
                // });
                // res.json({ 
                //     success: false, 
                //     message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' 
                // });
                throw err;
            } else {
                var token = req.params.token;
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Activation link has expired.'
                        });
                    } else if (!user) {
                        res.json({
                            success: false,
                            message: 'Activation link has expired.'
                        });
                    } else {
                        user.temporarytoken = false;
                        user.active = true;
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                var email = {
                                    from: 'Ei-Ji Company Staff, jirayu_ch01@hotmail.com',
                                    to: user.email,
                                    subject: 'Account Activated',
                                    text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                                    html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                                };                                
                                client.sendMail(email, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(info);
                                        console.log(user.email);
                                    }
                                });
                                res.json({
                                    success: true,
                                    message: 'Account activated!'
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({
                success: false,
                message: 'No token provided'
            });
        }
    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    return router;
};