const file = require('./file-util-v1');
const express = require('express');
const server = express();

server.get('/', (req, res) => {
  res.redirect('/files');
});

server.get('/files', (req, res) => {
  var fileList = file.listFile(req.query.path);
  res.header("Content-Type", 'application/json');
  res.send(JSON.stringify(fileList, null, 4));
})

server.listen(8080, () => {
  console.log('listening on 8080')
})
