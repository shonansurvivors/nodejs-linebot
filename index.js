const crypto = require('crypto');
const line = require('@line/bot-sdk');
const client = new line.Client({
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
});

exports.handler = function (event, context, callback) {

  // 署名の検証
  const signature = crypto.createHmac('sha256', process.env.CHANNEL_SECRET).update(event.body).digest('base64');
  if (signature !== event.headers['X-Line-Signature']) {
    callback(
      null,
      {
        statusCode:404,
        body: '{"Error": "Invalid Signature"}'
      },
    );
    return;
  }

  // オウム返し
  const body = JSON.parse(event.body);
  client.replyMessage(
    body.events[0].replyToken,
    {
      type: 'text',
      text: body.events[0].message.text,
    },
  );
};
