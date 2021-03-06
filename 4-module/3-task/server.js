const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes(path.sep)) {
        res.statusCode = 400;
        res.end();
        break;
      }

      if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
        res.statusCode = 404;
        res.end();
        break;
      }

      fs.unlinkSync(filepath);
      res.statusCode = 200;
      res.end();
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
