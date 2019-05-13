const Koa = require('koa');
const Chat = require('./chat');
const app = new Koa();
const chat = new Chat();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx) => {
  await new Promise((resolve) => chat.subscribe({resolve, ctx}));
});

router.post('/publish', async (ctx) => {
  const message = ctx.request.body.message;
  if (message) {
    chat.send(message);
    ctx.body = 'ok';
  } else {
    ctx.status = 400;
    ctx.body = 'bad request';
  }
});

app.use(router.routes());

module.exports = app;
