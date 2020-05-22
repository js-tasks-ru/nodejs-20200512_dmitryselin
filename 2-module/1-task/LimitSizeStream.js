const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super({
      ...options,
      encoding: options.encoding || 'utf-8',
    });
    this._limit = options && options.limit;
    this._dataCounter = 0;
  }

  _transform(chunk, encoding, callback) {
    const newDataLength = this._dataCounter + chunk.length;

    if (newDataLength <= this._limit) {
      this.push(chunk);
      this._dataCounter = newDataLength;
      callback();
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
