const axios = require('axios');

export type SlackPayload = {
  channel: string;
  text: string;
  token: string;
};

export const postSlackMessage = async (payload: SlackPayload) => {
  console.log('Trying to post a response', payload);
  const url = '	https://slack.com/api/chat.postMessage';
  console.log('Trying to post', { payload }, 'to ', url);
  axios
    .post(url, {
      ...payload
    })
    .then(function(response) {
      console.log('Got response from Slack', response);
    })
    .catch(function(error) {
      console.error('ERROR in posting to Slack', error);
    });
};
