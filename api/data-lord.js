
var kt = require('kutility');
var secrets = require('./secrets');

var instagramClient = require('./instagram');
instagramClient.init(secrets.INSTAGRAM_CLIENT_ID, secrets.INSTAGRAM_CLIENT_SECRET);

// instagram.randomGalleryMedia(function(err, res) {
//   var data = res.data;
//   var compressedData = instagram.compress(data);
//   console.log(compressedData);
// });

var cache = {
  instagram: {}
};

module.exports.instagram = function(locationID, callback) {
  if (!callback) {
    return;
  }

  var cached = cache.instagram[locationID];
  if (cached) {
    callback(null, cached);
    return;
  }

  _instagram(locationID, function(err, data) {
    if (err) {
      callback(err, null);
    }
    else {
      cache.instagram[locationID] = data;
      callback(null, data);
    }
  });
};

function _instagram(locationID, callback) {
  instagramClient.locationMedia(locationID, function(err, res) {
    if (err) {
      callback(err, res);
      return;
    }

    var compressedData = instagramClient.compress(res.data);
    callback(null, compressedData);
  });
};

function updateRandomCacheItem() {
  var mediaCacheKey = kt.choice(['instagram']);
  var mediaCache = cache[mediaCacheKey];
  var secondaryKey = kt.choice(Object.keys(mediaCache));

  if (mediaCacheKey === 'instagram') {
    _instagram(secondaryKey, function(err, data) {
      if (data) {
        mediaCache[secondaryKey] = data;
      }
    });
  }
}

setInterval(function() {
  updateRandomCacheItem();
}, 20 * 1000);
