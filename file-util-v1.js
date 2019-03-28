const fs = require('fs')

var readFile = function(filename, charset) {
  fs.readFile(filename, charset, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log(data);
    }
  });
}

exports.readFile = readFile;
