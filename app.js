require('dotenv').config();
const line = require('@line/bot-sdk');
const express = require('express');
const GContext = require('./gameContext');
const app = express();

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);
const gcontext = new GContext(client);
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(event => gcontext.handleEvent(event)))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});


// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
