
var request = require('superagent');
var kt = require('kutility');

var InstagramBase = 'https://api.instagram.com/v1/';

var credentials;

module.exports.init = function(clientID, clientSecret) {
  credentials = {
    'client_id': clientID,
    'client_secret': clientSecret
  };
};

module.exports.request = function(endpoint, callback) {
  var url = InstagramBase + endpoint;
  request
    .get(url)
    .query(credentials)
    .end(function(err, res) {
      if (err) {
        console.log('instagram error:');
        console.log(err);
        if (callback) {
          callback(err, res);
        }
      }
      else {
        var data = res.body;
        if (callback) {
          callback(err, data);
        }
      }
    });
};

module.exports.locationMedia = function(locationID, callback) {
  var endpoint = 'locations/' + locationID + '/media/recent';
  module.exports.request(endpoint, callback);
};

module.exports.randomGalleryMedia = function(callback) {
  var galleryIDs = ['212943401', '294847', '1218268', '401192748'];
  module.exports.locationMedia(kt.choice(galleryIDs), callback);
}
