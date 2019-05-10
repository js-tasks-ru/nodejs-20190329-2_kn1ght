const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options && options.encoding;
    this.bufferedChunks = '';
  }

  _transform(chunk, encoding, callback) {
    const strChunk = chunk.toString(this.encoding);
    if (strChunk.indexOf(os.EOL) === -1) {
      this.bufferedChunks += strChunk;
    } else {
      const chunkArr = strChunk.split(os.EOL);

      chunkArr.forEach((chunkPart)=> {
        let resultedChunk = '';

        if (this.bufferedChunks) {
          resultedChunk = this.bufferedChunks + chunkPart;
          this.bufferedChunks = '';
        } else {
          resultedChunk = chunkPart;
        }

        this.push(resultedChunk);
      });
    }
    callback(null, null);
  }

  _flush(callback) {
    callback(null, null);
  }
}

module.exports = LineSplitStream;
