const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes(path.sep)) {
        res.statusCode = 400;
        res.end();
        break;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end();
        break;
      }

      const fileStats = fs.statSync(filepath);
      if (!fileStats.isFile()) {
        res.statusCode = 404;
        res.end();
        break;
      }

      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileStats.size,
      });

      const readStream = fs.createReadStream(filepath);
      readStream.pipe(res);
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
