var path = require('path');
var httpHelpers = require('./http-helpers.js');
var fs = require('fs');
var htmlFetcherHelpers = require('../workers/lib/html-fetcher-helpers.js');

module.exports.indexdir = path.join(__dirname, "./public/index.html")
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.
// module.exports.sitesDir = path.join(__dirname, "../data/sites/");

var status = 200;

var fetchUrls = function(req, res, filePath) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err; // this may need to be revised to account for chunking of larger data
    status = 200;
    res.writeHead(status, httpHelpers.headers);
    res.end(data);
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
      res.writeHead(status, httpHelpers.headers);
      res.end(indexHtml);
    });
  });
};

var actionList = {
  'GET': fetchUrls,
  'POST': addUrls
}

module.exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);

  if (req.method === 'GET' && req.url === '/') { // this will serve up the html page
    actionList[req.method](req,res, exports.indexdir);
  } else if (req.method === 'GET') {
    actionList[req.method](req, res, exports.datadir);
  } else if (req.method === 'POST') {
    actionList[req.method](req, res, exports.datadir);
  } else {
    // TODO: Options, 404
  }
};
