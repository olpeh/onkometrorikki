const request = require('request');
const _ = require('lodash');
import { Status } from './../models/Status';

require('dotenv').config();
const debugBrokenRandomly =
  process.env.DEBUG_BROKEN_RANDOMLY === 'true' || false;

export const fetchFeed = async () => {
  console.log('Going to fetch from the external API');
  return new Promise((resolve, reject) => {
    if (debugBrokenRandomly && Math.random() >= 0.5) {
      console.log(`******************** Debug RANDOMLY BREAK mode on!*************************
      Serving alerts randomly from test binary feed and randomly from real feed!`);
      const fs = require('fs');
      const path = require('path');
      const content = fs.readFileSync(
        path.join(__dirname, '../tests/assets/graphql-response.json')
      );
      const feed = JSON.parse(content).data.alerts;
      resolve(feed);
    } else {
      const requestOptions = {
        method: 'POST',
        url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
        headers: { 'Content-Type': 'application/graphql' },
        body: `{
          alerts(severityLevel: [WARNING, UNKNOWN_SEVERITY, SEVERE]) {
            alertDescriptionTextTranslations {
              text
              language
            }
            route{
              mode
            }
            effectiveEndDate
          }
        }`
      };

      try {
        request(requestOptions, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log('Fetch successful!');
            try {
              const alerts = JSON.parse(body).data.alerts;
              resolve(alerts);
            } catch (e) {
              console.error('Error in parsing the response', e);
              reject(e);
            }
          } else {
            console.error(error, JSON.stringify(response, null, 4));
            reject(error);
          }
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    }
  });
};

export const createResponse = (feed): Status => {
  const defaultResponse: Status = {
    broken: false,
    reasons: []
  };

  if (!feed) {
    console.log('No feed was provided...');
    return {
      ...defaultResponse,
      reasons: ['Failed to fetch the feed. The Metro might work or might not.']
    };
  } else {
    // This duplicate filter should not be needed here
    const reasons = _.uniq(
      feed
        // TODO: Why can't GraphQL do this filtering for me already?
        .filter(
          alert =>
            alert.route &&
            alert.route &&
            alert.route.mode === 'SUBWAY' &&
            alert.effectiveEndDate > Math.floor(Date.now() / 1000)
        )
        .map(alert => alert.alertDescriptionTextTranslations)
    );

    return {
      ...defaultResponse,
      broken: reasons && reasons.length > 0,
      reasons: [...defaultResponse.reasons, ...reasons]
    };
  }
};
