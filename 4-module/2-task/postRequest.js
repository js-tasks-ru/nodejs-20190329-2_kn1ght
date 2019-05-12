const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const FILE_LIMIT = 1024 * 1024;

const postRequest = (filepath, req, res) => {
  const limitSizeStream = new LimitSizeStream({limit: FILE_LIMIT});
  const wstream = fs.createWriteStream(filepath, {flags: 'wx'});

  if (req.headers['content-length'] === 0) {
    res.statusCode = 400;
    res.end('Content empty');
    return;
  }

  req
    .pipe(limitSizeStream)
    .on('error', (e) => {
      if (e instanceof LimitExceededError) {
        res.statusCode = 413;
        res.end('Payload Too Large');
      } else {
        res.statusCode = 400;
        res.end('Bad Request');
      }

      fs.unlink(filepath, (e) => {});
      wstream.destroy();
    })
    .pipe(wstream)
    .on('error', (e) => {
      if (e.code === 'EEXIST') {
        res.statusCode = 409;
        res.end('File Already Exists');
        return;
      }

      res.statusCode = 500;
      res.end('Internal Server Error');
    })
    .on('close', () => {
      res.statusCode = 201;
      res.end('File Created');
    });

  res.on('close', () => {
    if (res.finished) return;
    fs.unlink(filepath, (err) => {});
  });
};

module.exports = postRequest;
