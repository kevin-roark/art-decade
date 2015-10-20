
var express = require('express');
var secrets = require('./secrets');
var instagram = require('./instagram');

instagram.init(secrets.INSTAGRAM_CLIENT_ID, secrets.INSTAGRAM_CLIENT_SECRET);

var app = express();

app.get('/', function (req, res) {
  res.send('Hello Art Decade!');
});

module.exports = app;
