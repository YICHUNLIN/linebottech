require('dotenv').config();
const line = require('@line/bot-sdk');
const express = require('express');
const app = express();

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  const userId = event.source.userId;


  client.getProfile(userId)
  .then((profile) => {
    console.log(profile.displayName);
    // create a echoing text message
    const echo = { type: 'text', text: `${profile.displayName} say ${event.message.text} ` };
  
  
    // use reply API
    return client.replyMessage(event.replyToken, echo);
  })
  .catch((err) => {
    // error handling
  });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
