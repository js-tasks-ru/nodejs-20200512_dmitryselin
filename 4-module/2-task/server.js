const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const FILE_SIZE_LIMIT = 1024 * 1024;

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filedir = path.join(__dirname, 'files');
  const filepath = path.join(filedir, pathname);

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

      if (!fs.existsSync(filedir) || !fs.statSync(filedir).isDirectory()) {
        fs.mkdirSync(filedir);
      }

      const writeStream = fs.createWriteStream(filepath);
      let counter = 0;

      req.on('data', (chunk) => {
        const newCounterValue = counter + chunk.length;

        if (newCounterValue > FILE_SIZE_LIMIT) {
          fs.unlink(filepath, () => {});
          res.statusCode = 413;
          res.end();
        } else {
          writeStream.write(chunk);
          counter = newCounterValue;
        }
      });

      req.on('close', () => {
        if (!req.readableEnded) {
          writeStream.end();
          fs.unlink(filepath, () => {});
        }
      });

      req.on('end', (chunk) => {
        writeStream.end(chunk);
        res.statusCode = 201;
        res.end();
      });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
