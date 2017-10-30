var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/ei-jicompany', { useMongoClient: true }, function (err) {
    if (err) {
        console.log('Not connected to MongoDB!' + err);
    } else {
        console.log('Successfully connected to MongoDB!');
    }
});

app.post('/users', function (req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if (req.body.username == null || req.body.username == '' ||
        req.body.password == null || req.body.password == '' ||
        req.body.email == null || req.body.email == '') {
        res.send('Ensure username, email and password were provided!');
    } else {
        user.save(function (err) {
            if (err) {
                res.send('Username or Email already exists!');
            } else {
                res.send('create user!')
            }
        });
    }
});

app.listen(port, function () {
    console.log('Running the server on port ' + port);
});