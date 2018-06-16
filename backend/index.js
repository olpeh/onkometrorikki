const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();
const http = require('http');
const parseString = require('xml2js').parseString;

require('dotenv').config();

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 3000;
console.log(process.env.PORT);

async function setUpApp() {
  app.use(
    route.get('/api/isitbroken', async ctx => {
      console.log('Got the request');
      ctx.response.statusCode = 200;
      const url = 'http://www.poikkeusinfo.fi/xml/v3';
      try {
        const req = await http.get(url, function(res) {
          console.log('Got http response for ' + url);
          let xml = '';

          res.on('data', function(chunk) {
            xml += chunk;
          });

          res.on('error', function(e) {
            console.error(e);
            ctx.response.statusCode = 500;
            ctx.response.body = e;
          });

          res.on('timeout', function(e) {
            console.error(e);
            ctx.response.statusCode = 500;
            ctx.response.body = e;
          });

          res.on('end', function() {
            console.log('Response ended');
            parseString(xml, function(err, result) {
              console.log('ParseString returned', err, result);
              if (err) {
                console.log('Parsing the XML string failed');
                console.error(err);
                ctx.response.statusCode = 500;
                ctx.response.body = err;
              }
              // console.log(JSON.stringify(data, null, 2));
              const dataToRespondWith = {
                success: true,
                broken: true,
                data: result,
                reasons: ['Only god knows', '???'],
              };

              console.log('Success, going to respond with', dataToRespondWith);
              ctx.response.statusCode = 200;
              ctx.response.body = dataToRespondWith;
            });
          });
        });
      } catch (err) {
        console.log('Error was caught');
        console.error(err);
        ctx.response.statusCode = 500;
        ctx.response.body = err;
      }
    }),
  );

  console.log('app listening on port ' + port);

  app.listen(port);
}

setUpApp();
