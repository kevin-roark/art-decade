
var express = require('express');
var dataLord = require('./data-lord');

var app = express();

app.get('/instagram', function (req, res) {
  var locationID = req.query.locationID;
  if (!locationID) {
    res.status(404);
    res.json({error: 'need a location id'});
    return;
  }

  dataLord.instagram(locationID, function(err, data) {
    if (err) {
      console.log(err);
      res.status(err.status || 500);
      res.json({error: err});
    }
    else {
      res.json(data);
    }
  });
});

module.exports = app;
