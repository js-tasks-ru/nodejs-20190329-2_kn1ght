const fs = require('fs');

const getRequest = (pathToFile, res) => {
  const rstream = fs.createReadStream(pathToFile);

  rstream.pipe(res);

  rstream.on('error', (e) => {
    res.statusCode = 404;
    res.end('File not found');
  });

  res.on('close', () => {
    rstream.destroy();
  });
};

module.exports = getRequest;
