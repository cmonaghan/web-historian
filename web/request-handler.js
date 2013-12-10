var path = require('path');
var httpHelpers = require('./http-helpers.js');
var fs = require('fs');
var htmlFetcherHelpers = require('../workers/lib/html-fetcher-helpers.js');

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var status = 200;

module.exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);

  var filePath = exports.datadir;
  var dataToSend = htmlFetcherHelpers.readUrls( filePath );



  var fileContents;

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err;
    console.log('data is', data);
    fileContents = data; // this may need to be revised to account for chunking of larger data
  });

  console.log(fileContents);





  res.writeHead(status, httpHelpers.headers);
  res.end(dataToSend);

  console.log("res._data is ", res._data);
};
