const url = require('url');
const http = require('http');
const path = require('path');

const deleteRequest = require('./deleteRequest');

const server = new http.Server();

server.on('request', (req, res) => {
  let decodedUrl;

  try {
    decodedUrl = decodeURIComponent(req.url);
  } catch (e) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  const pathname = url.parse(decodedUrl).pathname.slice(1);

  if (checkIfNestedFolder(pathname)) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      deleteRequest(filepath, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

const checkIfNestedFolder = (pathname) => pathname.indexOf('/') !== -1;

module.exports = server;
