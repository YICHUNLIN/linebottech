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

const data = {};

function checkNumber(input) { 
  var re = /^[0-9]*/g;//判斷字串是否為數字//判斷正整數/[1−9] [0−9]∗]∗/ 
    if (!re.test(nubmer)) { 
      return -1
    } 
    return parseInt(input)
}

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  const userId = event.source.userId;


  client.getProfile(userId)
  .then((profile) => {
    console.log(event);
    var mapId = event.source.groupId || event.source.userId
    if (event.message.text == "開始遊戲"){
      data[mapId] = Math.floor(Math.random()*100);
      const echo = { type: 'text', text: `歡迎 ${profile.displayName} 開起一個遊戲，請猜1-100` };
      return client.replyMessage(event.replyToken, echo);
    } 
    else if(!data.hasOwnProperty(mapId)){
      const echo = { type: 'text', text: `請先開局，輸入 '開始遊戲'` };
      return client.replyMessage(event.replyToken, echo);
    }
    else if(data.hasOwnProperty(mapId)) {
      // do check number
      const num = parseInt(event.message.text);
      console.log(num);
      if (isNaN(num)) {
        const echo = { type: 'text', text: `請輸入數字` };
        return client.replyMessage(event.replyToken, echo);
      } else {

        const text = num > data[mapId] ? '再小一點' : (num == data[mapId] ? `恭喜 ${profile.displayName} 猜對了` : '再大一點')
        const echo = { type: 'text', text: text };
        if (num == data[mapId])
          delete data[mapId];
        return client.replyMessage(event.replyToken, echo);
      }
    }else {
      console.log(data)
    }




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
