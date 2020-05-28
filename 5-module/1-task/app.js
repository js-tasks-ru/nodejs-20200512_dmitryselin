const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let clients = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve, reject) => {
    clients.push(resolve);

    ctx.res.on('close', () => {
      clients.splice(clients.indexOf(resolve), 1);
      reject(new Error('Client disconnected'));
    });
  });

  ctx.body = await promise;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message) {
    clients.forEach((resolveFunc) => {
      resolveFunc(message);
    });
    clients = [];
    ctx.response.status = 200;
  }
});

app.use(router.routes());

module.exports = app;
