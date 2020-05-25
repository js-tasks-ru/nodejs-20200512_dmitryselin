const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const FILE_SIZE_LIMIT = 1024 * 1024;

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes(path.sep)) {
        res.statusCode = 400;
        res.end();
        break;
      }

      if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
        res.statusCode = 409;
        res.end();
        break;
      }

      const writeStream = fs.createWriteStream(filepath);
      let counter = 0;

      req.on('data', (chunk) => {
        const newCounterValue = counter + chunk.length;

        if (newCounterValue > FILE_SIZE_LIMIT) {
          res.statusCode = 413;
          res.end();
          fs.unlink(filepath, () => {});
        } else {
          writeStream.write(chunk);
          counter = newCounterValue;
        }
      });

      req.on('close', () => {
        if (!req.readableEnded) {
          fs.unlink(filepath, () => {});
        }
      });

      req.on('end', () => {
        res.statusCode = 201;
        res.end();
        writeStream.end();
      });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
