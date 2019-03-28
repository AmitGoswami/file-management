const fs = require('fs')

var listFile = function(dirname) {
  var filelist = [];
  var data = fs.readdirSync(dirname);
  data.forEach(file => {
    filelist.push(file);
  });
  return filelist;
}

exports.listFile = listFile;
