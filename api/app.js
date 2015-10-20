
var express = require('express');
var secrets = require('./secrets');
var instagram = require('./instagram');

instagram.init(secrets.INSTAGRAM_CLIENT_ID, secrets.INSTAGRAM_CLIENT_SECRET);

var app = express();

app.get('/', function (req, res) {
  res.send('Hello Art Decade!');
});

instagram.randomGalleryMedia(function(err, res) {
  var data = res.data;
  var compressedData = instagram.compress(data);
  console.log(compressedData);
});

module.exports = app;
