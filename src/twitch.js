const WebSocket = require("ws");
const hue = require("./hue");

const ws = new WebSocket("wss://pubsub-edge.twitch.tv");

ws.on("open", function open() {
  console.log("connected");
  ws.send(
    JSON.stringify({
      type: "LISTEN",
      nonce: "44h1k13746815ab1r2",
      data: {
        topics: [`channel-points-channel-v1.${process.env.TWITCH_CHANNEL_ID}`],
        auth_token: process.env.TWITCH_TOKEN,
      },
    })
  );
});

ws.on("close", function close() {
  console.log("disconnected");
});

ws.on("message", function incoming(data) {
  const json = JSON.parse(data);
  if (!json.data) {
    return;
  }

  const message = JSON.parse(json.data.message);

  if (!message.data.redemption.reward) {
    return;
  }

  const reward = message.data.redemption.reward;

  if (reward.id === process.env.TWITCH_REWARD_ID) {
    hue({ on: false });

    setTimeout(() => {
      hue({ on: true });
    }, 10 * 1000);
  }
});
