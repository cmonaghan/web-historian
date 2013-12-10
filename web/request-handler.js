var path = require('path');
var httpHelpers = require('./http-helpers.js');
var fs = require('fs');
var htmlFetcherHelpers = require('../workers/lib/html-fetcher-helpers.js');

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var status = 200;

var fetchUrls = function(req, res, filePath) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err; // this may need to be revised to account for chunking of larger data
    res.writeHead(status, httpHelpers.headers);
    res.end(data);
  });
}

var addUrls = function(req, res) {
  // do some stuff
}

var actionList = {
  'GET': fetchUrls,
  'POST': addUrls
}

module.exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);


  if (req.method === 'GET') {
    actionList[req.method](req, res, exports.datadir);
  } else if (req.method === 'POST') {
    actionList[req.method](xxx, yyy, zzz);
  } else {
    // TODO: Options, 404
  }
};
