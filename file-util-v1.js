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
var renameSRTtoVideoFileName = function(dirname) {
  var videoFileNameFormat = {
    serialName: '1,2',
    episodeNumber: '3',
    episodeName: '4',
    nameSeparator: ' '
  };
  const subtitleFile = 'srt';
  var listOfFiles = fs.readdirSync(dirname);
  listOfFiles.forEach(file => {
    var extn = file.substring(file.lastIndexOf('.') + 1);
    if (!file.includes(subtitleFile)) {
      file = file.substring(0, file.lastIndexOf('.'));
      var episodeName = file.split(videoFileNameFormat.nameSeparator)[videoFileNameFormat.episodeName - 1];
      var fileWithextn = fileWithExtn(dirname, subtitleFile);
      fileWithextn.forEach(filename => {
        if (filename.includes(episodeName)) {
          var newFileName = file.substring(file.lastIndexOf('.') + 1) + '.' + subtitleFile;
          if (newFileName != filename) {
            console.log(`renaming file "${filename}" to "${newFileName}"`);
            fs.rename(dirname + '\\' + filename, dirname + '\\' + newFileName, function(err) {
              if (err) {
                console.log(err);
              }
            });
          }
        }
      })
    }
  });
}
var fileWithExtn = function(dirname, _extn) {
  var listOfFiles = fs.readdirSync(dirname);
  var extnFileList = [];
  listOfFiles.forEach(file => {
    var extn = file.substring(file.lastIndexOf('.') + 1);
    if (extn == _extn) {
      extnFileList.push(file);
    }
  });
  return extnFileList;
}
renameSRTtoVideoFileName("C:\\Users\\amigo\\Downloads\\12 Monkeys Season 3 Complete 720p HDTV x264 [i_c]")
//exports.listFile = listFile;
