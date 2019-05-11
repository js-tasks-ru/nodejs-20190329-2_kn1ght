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
        // console.error(e);

        if (e instanceof LimitExceededError) {
          res.statusCode = 413;
          res.end('Payload Too Large');
        } else {
          res.statusCode = 400;
          res.end('Bad Request');
        }

        fs.unlink(filepath, (e) => {
          if (e) console.error(e);
        });
        wstream.destroy();
      })
      .pipe(wstream)
      .on('finish', () => {
        res.statusCode = 201;
        res.end('File Created');
      })
      .on('error', (e) => {
        // console.error(e);

        if (e.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File Already Exists');
          return;
        }

        res.statusCode = 500;
        res.end('Internal Server Error');
      });

  res.on('close', () => {
    if (res.finished) return;
    fs.unlink(filepath, (err) => {});
  });

  req.on('error', (e) => {
    // console.log(e);
  });
};

module.exports = postRequest;
