const fs = require('fs');

const deleteRequest = (pathToFile, res) => {
  fs.unlink(pathToFile, e => {
    if (e) {
      res.statusCode = 404;
      res.end('File not found');
    } else {
      res.statusCode = 200;
      res.end('ok');
    }
  });
};

module.exports = deleteRequest;
