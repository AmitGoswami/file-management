const fs = require('fs');
const mime = require("mime");

const subtitleFile: string = 'srt';

export interface fileMap {
    dirName: string;
    fileList: string[];
}

export interface videoFileNameFormat {
    episodeNumber: number,
    nameSeparator: string
};

export function listFile(dirname: string, fileMapList: fileMap[]) {

    fileMapList = fileMapList || [];
    // read all files in the directory
    let data: string[] = fs.readdirSync(dirname);

    let fileMap = {} as fileMap;
    fileMap.dirName = dirname;
    fileMap.fileList = data;

    // iterate all the files to check if its a directory or not
    data.forEach(file => {
        var fileName: string = dirname + '\\' + file;
        var isDir: boolean = isDirectory(fileName);

        if (isDir == true) {
            // if the current file is directory read all the files in it recurcively.
            listFile(fileName, fileMapList)
        }
    });
    fileMapList.push(fileMap);
    return fileMapList;
}
export function renameSRTtoVideoFileName(dirname: string) {

    let videoFileNameFormat = {} as videoFileNameFormat;
    videoFileNameFormat.episodeNumber = 4;
    videoFileNameFormat.nameSeparator = '-';

    var listOfFiles: string[] = fs.readdirSync(dirname);

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
function fileWithExtn(dirname: string, _extn: string) {
    var listOfFiles: string[] = fs.readdirSync(dirname);
    var extnFileList = [];
    listOfFiles.forEach(file => {
        var extn = file.substring(file.lastIndexOf('.') + 1);
        if (extn == _extn) {
            extnFileList.push(file);
        }
    });
    return extnFileList;
}

export function organizeFiles(dirname: string) {
    let files: string[] = fs.readdirSync(dirname);
    files.forEach(file => {
        let fullfileName: string = dirname + '/' + file;
        console.log('reading ' + fullfileName)
        let isDir: boolean = isDirectory(fullfileName);
        if (isDir == true) {
            console.log(file + ' is a directory, skipping the process')
            return;
        }

        let fileType: string = getFileType(fullfileName);
        let newDir: string = dirname + '/' + fileType;
        if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir);
        }
        console.log('moving ' + fullfileName + ' to ' + (newDir + '/' + file));
        fs.rename(fullfileName, newDir + '/' + file, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });

}

function getFileType(filename: string) {
    let extn: string = getFileExtension(filename);
    let fileType: string = mime.lookup(extn);
    let type: string = fileType.split('/')[1];
    if (type.includes('.')) {
        let types: string[] = type.split('.');
        return types[types.length - 1];
    }
    return type;
}

function isDirectory(dirname: string) {
    let isDir: boolean = false;
    try {
        isDir = fs.lstatSync(dirname).isDirectory();
    } catch (e) {
        console.log(e);
    }
    return isDir;
}

function getFileExtension (filename:string) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
}