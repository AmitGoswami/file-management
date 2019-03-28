const file = require('./file-util-v1');
const express = require('express');
const server = express();

server.get('/', (req, res) => {
  res.redirect('/files');
});

server.get('/files', (req, res) => {
  var fileList = file.listFile('.');
  res.send(fileList);
})

server.listen(8080, () => {
  console.log('listening on 8080')
})
