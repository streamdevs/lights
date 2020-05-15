const WebSocket = require("ws");
const hue = require("./hue");

function ping(ws) {
  console.log("INFO: ping...");
  ws.send(
    JSON.stringify({
      type: "PING",
    })
  );
}

function connect() {
  const pingInterval = 1000 * 60; //ms between PING's
  const reconnectInterval = 1000 * 3; //ms to wait before reconnect
  let pingHandle;

  const ws = new WebSocket("wss://pubsub-edge.twitch.tv");

  ws.on("open", function open() {
    console.log("INFO: Connected");
    ws.send(
      JSON.stringify({
        type: "LISTEN",
        nonce: "44h1k13746815ab1r2",
        data: {
          topics: [
            `channel-points-channel-v1.${process.env.TWITCH_CHANNEL_ID}`,
          ],
          auth_token: process.env.TWITCH_TOKEN,
        },
      })
    );

    ping(ws);
    pingHandle = setInterval(() => ping(ws), pingInterval);
  });

  ws.on("close", function close() {
    console.log("INFO: Disconnected");
    clearInterval(pingHandle);
    console.log("INFO: Reconnecting...");
    setTimeout(connect, reconnectInterval);
  });

  ws.on("message", function message(data) {
    const json = JSON.parse(data);

    if (json.type === "PONG") {
      console.log("INFO: ...pong");
    }

    if (json.type == "RECONNECT") {
      console.log("INFO: Reconnecting...");
      setTimeout(connect, reconnectInterval);
    }

    if (!json.data) {
      return;
    }

    const message = JSON.parse(json.data.message);

    if (!message.data.redemption.reward) {
      return;
    }

    const reward = message.data.redemption.reward;

    if (reward.id === process.env.TWITCH_REWARD_ID) {
      console.log("INFO: Reward redeem");
      hue({ on: false });

      setTimeout(() => {
        hue({ on: true });
      }, 10 * 1000);
    }
  });
}

connect();
