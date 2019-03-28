const file = require('./file-util-v1');
const express = require('express');
const server = express();

server.get('/', (req, res) => {
  res.redirect('/welcome');
});

server.get('/welcome', (req, res) => {
  res.send('welcome buddy');
})

server.get('/welcome/:user', (req, res) => {
  res.send('welcome ' + req.params.user);
})
server.listen(8080, () => {
  console.log('listening on 8080')
})
