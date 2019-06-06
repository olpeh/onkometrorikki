const axios = require('axios');

export type SlackPayload = {
  channel: string;
  text: string;
  token: string;
};

export const postSlackMessage = async (payload: SlackPayload) => {
  const baseUrl = '	https://slack.com/api/chat.postMessage';
  const { channel, text, token } = payload;
  const url = `${baseUrl}?token=${token}&channel=${channel}&text=${encodeURI(
    text
  )}&pretty=1`;
  console.log('Trying to post a response to Slack', payload.text);
  axios
    .post(url)
    .then(function(response) {
      console.log('Got response from Slack', response.data);
    })
    .catch(function(error) {
      console.error('ERROR in posting to Slack', error);
    });
};
