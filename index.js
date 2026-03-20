const express = require('express');
const line = require('@line/bot-sdk');
const Anthropic = require('@anthropic-ai/sdk');

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

const client = new line.Client(config);
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

const app = express();

app.post('/webhook', line.middleware(config), async (req, res) => {
  res.sendStatus(200);
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: event.message.text }]
      });
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: response.content[0].text
      });
    }
  }
});

app.listen(process.env.PORT || 3000);
