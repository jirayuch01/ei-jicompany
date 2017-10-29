var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');

app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/ei-jicompany', { useMongoClient: true }, function (err) {
    if (err) {
        console.log('Not connected to MongoDB!' + err);
    } else {
        console.log('Successfully connected to MongoDB!');
    }
});

app.listen(port, function () {
    console.log('Running the server on port ' + port);
});