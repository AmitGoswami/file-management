const fs = require('fs')
var fileMapList = [];


var listFile = function(dirname) {
  var fileMap = {};
  var filelist = [];
  var data = fs.readdirSync(dirname);
  fileMap.dirName = dirname;
  fileMap.fileList = data;

  data.forEach(file => {
    var fileName;
    fileName = dirname + '\\' + file;
    var stat;
    try {
      stat = fs.statSync(fileName);
    } catch (e) {
      console.log(e);
    }

    if (stat && stat.isDirectory()) {
      // recurcive
      listFile(fileName)
    } else {
      filelist.push(file);
    }
  });
  fileMapList.push(fileMap);
  return fileMapList;
}

exports.listFile = listFile;
