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

var addUrls = function(req, res, filePath) {
  var body = '';

  req.on('data', function(chunk) {
    body += chunk;
  });

  req.on('end', function() {
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

var actionList = {
  'GET': fetchUrls,
  'POST': addUrls
}

var storedUrls = {
  '/www.google.com': true
}

module.exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);

  // // if accessing homepage, serve up index.html
  // if (actionList[req.method] && req.url === '/'){
  //   actionList[req.method](req, res, exports.indexdir);
  // // if accessing another url, serve up that url
  // } else if (actionList[req.method]) { // still need to add a test to see if that url exists (otherwise serve up the homepage)
  //   actionList[req.method](req, res, exports.sitesdir + req.url);
  // } else {
  //   status = 404;
  //   sendResponse(req, res);
  // }

  if (req.method === 'GET') {
    actionList[req.method](req, res);
  } else if (req.method === 'POST') {
    actionList[req.method](req, res, exports.datadir);
  } else {
    // TODO: Options, 404
  }
};










