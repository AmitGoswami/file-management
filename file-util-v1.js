const fs = require('fs')

var listFile = function(dirname, fileMapList) {
  fileMapList = fileMapList || [];

  var fileMap = {};
  // read all files in the directory
  var data = fs.readdirSync(dirname);
  fileMap.dirName = dirname;
  fileMap.fileList = data;

  // iterate all the files to check if its a directory or not
  data.forEach(file => {
    var fileName = dirname + '\\' + file;
    var stat;
    try {
      stat = fs.statSync(fileName);
    } catch (e) {
      console.log(e);
    }

    if (stat && stat.isDirectory()) {
      // if the current file is directory read all the files in it.
      // recurcive
      listFile(fileName, fileMapList)
    }
  });
  fileMapList.push(fileMap);
  return fileMapList;
}

exports.listFile = listFile;
