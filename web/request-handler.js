var path = require('path');
var httpHelpers = require('./http-helpers.js');

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var status = 200;

module.exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);
  var data = exports.datadir;

  res.writeHead(status, httpHelpers.headers);
  res.end('/<input/');

  console.log("res._data is ", res._data);
};
