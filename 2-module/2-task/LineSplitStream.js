const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._buf = '';
  }

  _transform(chunk, encoding, callback) {
    const fullChunk = this._buf + chunk.toString();
    const lines = fullChunk.split(os.EOL);
    this._buf = lines.pop();
    for (const line of lines) {
      this.push(line);
    }
    callback();
  }

  _flush(callback) {
    if (this._buf) {
      this.push(this._buf);
    }
    callback();
  }
}

module.exports = LineSplitStream;
