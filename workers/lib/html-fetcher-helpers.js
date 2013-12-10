var fs = require('fs');

exports.readUrls = function(filePath, cb){
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err; // this may need to be revised to account for chunking of larger data
    cb(data);
  });
};

exports.downloadUrls = function(urls){
  // fixme
};
