const fs = require('fs')
const subtitleFile = 'srt';
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
      var episodeNumber = videoFileName.split(videoFileNameFormat.nameSeparator)[videoFileNameFormat.episodeNumber-1];
      
      // get all the subtitle files 
      var fileWithextn = fileWithExtn(dirname, subtitleFile);
      
      fileWithextn.forEach(filename => {

        // if the subtitle file matches with the video episode number, rename it
        if (filename.toUpperCase().includes(episodeNumber.toUpperCase())) {
          var newFileName = videoFileName + '.' + subtitleFile;
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


// get all the files with the extn as _extn
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
exports.listFile = listFile;
