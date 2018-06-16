const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();
const http = require('http');
const parseString = require('xml2js').parseString;
const request = require('koa-request');

require('dotenv').config();

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 3000;
console.log(process.env.PORT);

async function setUpApp() {
  app.use(
    route.get('/api/isitbroken', async ctx => {
      console.log('Got the request');
      const url = 'http://www.poikkeusinfo.fi/xml/v3';
      try {
        await xmlToJson(url)
          .then(resultData => {
            const brokenAndReasons = checkIfBroken(resultData);
            const dataToRespondWith = {
              success: true,
              ...brokenAndReasons,
            };

            console.log('Success, going to respond with', dataToRespondWith);
            ctx.response.statusCode = 200;
            ctx.response.body = dataToRespondWith;
          })
          .catch(e => {
            console.log('Error in xmlToJson');
            console.error(e);
            ctx.response.statusCode = 500;
            ctx.response.body = e;
          });
      } catch (e) {
        console.log('Error was caught');
        console.error(e);
        ctx.response.statusCode = 500;
        ctx.response.body = e;
      }
    }),
  );

  console.log('app listening on port ' + port);

  app.listen(port);
}

const xmlToJson = async url =>
  new Promise((resolve, reject) => {
    http.get(url, function(res) {
      let xml = '';

      res.on('data', function(chunk) {
        xml += chunk;
      });

      res.on('error', function(e) {
        console.error('Request errored', e);
        reject(e);
      });

      res.on('timeout', function(e) {
        console.error('Request timed out');
        reject(e);
      });

      res.on('end', function() {
        console.log('Request ended');
        parseString(xml, function(err, result) {
          resolve(result);
        });
      });
    });
  });

const checkIfBroken = data => {
  console.log('Going to check if broken');
  let broken = false;
  let reasons = ['Only god knows'];

  if (!data) {
    broken = true;
    reasons = [
      'Error fetching the data, might work as well. Defaulting to broken Metro.',
    ];
  }

  // TODO: LOL make a better way to check if it's broken
  broken = /(metro$|länsimetro$)/i.test(JSON.stringify(data));

  return {
    broken,
    reasons,
  };
};

setUpApp();
