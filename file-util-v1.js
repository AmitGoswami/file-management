const { FILE } = require('dns');
const fs = require('fs');
const mime = require("mime");

const subtitleFile = 'srt';
var listFile = function (dirname, fileMapList) {
  fileMapList = fileMapList || [];

  var fileMap = {};
  // read all files in the directory
  var data = fs.readdirSync(dirname);
  fileMap.dirName = dirname;
  fileMap.fileList = data;

  // iterate all the files to check if its a directory or not
  data.forEach(file => {
    var fileName = dirname + '\\' + file;
    var isDir = isDirectory(fileName);

    if (isDir === true) {
      // if the current file is directory read all the files in it.
      // recurcive
      listFile(fileName, fileMapList)
    }
  });
  fileMapList.push(fileMap);
  return fileMapList;
}
var renameSRTtoVideoFileName = function (dirname) {
  var videoFileNameFormat = {
    episodeNumber: '4',
    nameSeparator: '.'
  };

  var listOfFiles = fs.readdirSync(dirname);

  listOfFiles.forEach(file => {

    // check for the video file
    if (!file.includes(subtitleFile)) {

      // get fileName of the video to rename the matching subtitle
      var videoFileName = file.substring(0, file.lastIndexOf('.'));

      // get episode number
      var episodeNumber = videoFileName.split(videoFileNameFormat.nameSeparator)[videoFileNameFormat.episodeNumber - 1];

      // get all the subtitle files 
      var fileWithextn = fileWithExtn(dirname, subtitleFile);

      fileWithextn.forEach(filename => {

        // if the subtitle file matches with the video episode number, rename it
        if (filename.toUpperCase().includes(episodeNumber.toUpperCase())) {
          var newFileName = videoFileName + '.' + subtitleFile;
          if (newFileName != filename) {
            console.log(`renaming file "${filename}" to "${newFileName}"`);
            fs.rename(dirname + '\\' + filename, dirname + '\\' + newFileName, function (err) {
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


// get all the files with the extn as _extn
var fileWithExtn = function (dirname, _extn) {
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

var organizeFiles = function (dirname) {
  var files = fs.readdirSync(dirname);
  files.forEach(file => {
    console.log('reading ' + file)
    var isDir = isDirectory(dirname + '/' +file);
    if (isDir === true) {
      console.log(file + ' is a directory, skipping the process')
      return;
    }
    var fullfileName = dirname + '/' + file;
    var fileType = getFileType(fullfileName);
    var newDir = dirname + '/' + fileType;
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
    }
    fs.rename(fullfileName, newDir + '/' + file, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

}

var getFileType = function (filename) {
  var extn = getFileExtension(filename);
  var fileType = mime.lookup(extn);
  var type = fileType.split('/')[1];
  return type;
}

var isDirectory = function (dirname) {
  var isDir = false;
  try {
    isDir = fs.lstatSync(dirname).isDirectory();
  } catch (e) {
    console.log(e);
  }
  return isDir;
}


var getFileExtension = function (filename) {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length);;
}

organizeFiles('C:/Users/Godzilla/Downloads');
exports.listFile = listFile;
exports.renameSRTtoVideoFileName = renameSRTtoVideoFileName;
exports.organizeFiles = organizeFiles;
