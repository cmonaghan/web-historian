var path = require('path');
var httpHelpers = require('./http-helpers.js');
var fs = require('fs');
var htmlFetcherHelpers = require('../workers/lib/html-fetcher-helpers.js');

module.exports.indexdir = path.join(__dirname, "./public/index.html");
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
module.exports.sitesdir = path.join(__dirname, "../data/sites");

var status = 404;

var sendResponse = function(req, res, data) {
  res.writeHead(status, httpHelpers.headers);
  res.end(data);
}

var fetchUrls = function(req, res) {
  // check to see if the requested url exists, otherwise serve up index.html
  if (req.url === '/') {
    status = 200;
    var filePath = exports.indexdir;
  } else if (req.url === '/www.google.com') {
    status = 200;
    var filePath = exports.sitesdir.concat(req.url);
  } else {
    status = 404;
    var filePath = exports.indexdir;
  }

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err; // this may need to be revised to account for chunking of larger data
    sendResponse(req, res, data);
  });
}

var addUrls = function(req, res) {
  var filePath = exports.datadir;
  var body = '';

  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {

    body = body.slice(4); // this deletes the initial 'url=' included before each url
    console.log('POSTed: ' + body);

    // store indexHtml so it can be passed into res.end() below
    var indexHtml = fetchUrls(req, res, exports.indexdir);
    body += '\n';

    fs.appendFile(filePath, body, function(err){
      if (err) throw err;
      status = 302;
      sendResponse(req, res, indexHtml);
    });
  });
};

var sendRequestFailure = function(req, res) {
  status = 404;
  sendResponse(req, res);
};

var actionList = {
  'GET': fetchUrls,
  'POST': addUrls,
  'failure': sendRequestFailure
}

module.exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);

  if (actionList[req.method]) {
    actionList[req.method](req, res);
  } else {
    actionList['failure'](req, res);
  }
};










