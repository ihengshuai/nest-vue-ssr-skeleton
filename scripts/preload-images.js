(function () {
  var images = window.__PINIA_DATA__ && window.__PINIA_DATA__.meta && window.__PINIA_DATA__.meta.preSources && window.__PINIA_DATA__.meta.preSources.images;
  var prop;
  var imageSlice = [];
  var i = 0;
  var len;

  for (prop in images) imageSlice.push([prop, images[prop]]);
  len = imageSlice.length;

  for (; i < len; i++) {
    createImageSource(imageSlice[i]);
  };

  function createImageSource(item) {
    var key = item[0];

    item = images[key] = {
      done: [],
      error: [],
      size: null
    };

    loadImage(key, function (img) {
      var i = 0;
      item.size = [img.width, img.height];
      for (; i < item.done.length; i++) item.done.shift()(img);
      item.error = [];
    }, function (key) {
      var i = 0;
      for (; i < item.error.length; i++) item.error.shift()(key);
      images[key] = null;
    }, function () {
      // if (++index === imageSlice.length) done();
    });
  }

  function loadImage(src, done, error, cb) {
    var img = new Image();
    img.onload = function () {
      done(img);
      cb();
    };
    img.onerror = function () {
      error(src);
      cb();
    };
    img.src = src + "?w=10";
  }
})();
