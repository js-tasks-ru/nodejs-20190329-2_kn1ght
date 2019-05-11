const fs = require('fs');
const mime = require('mime');

const getRequest = (pathToFile, res) => {
  const rstream = fs.createReadStream(pathToFile);

  const contentType = mime.getType(pathToFile);
  res.setHeader('Content-Type', contentType + ' ;encoding: utf-8');

  rstream.pipe(res);

  rstream.on('error', (e) => {
    console.error(e);
    res.statusCode = 404;
    res.end('File not found');
  });

  res.on('close', () => {
    rstream.destroy();
  });
};

module.exports = getRequest;
