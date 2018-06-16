const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();

require('dotenv').config();

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 3000;
console.log(process.env.PORT);

async function setUpApp() {
  app.use(
    route.get('/api/isitbroken', async ctx => {
      try {
        var data = {
          success: true,
          broken: true,
          reasons: ['Only god knows', '???'],
        };
        ctx.response.statusCode = 200;
        ctx.response.body = data;
      } catch (e) {
        console.error(e);
        ctx.response.statusCode = 500;
        ctx.response.body = e;
      }
    }),
  );

  console.log('app listening on port ' + port);

  app.listen(port);
}

setUpApp();
