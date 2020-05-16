import WebSocket from "ws";
import { updateLightStatus } from "./hue";
import { Firestore } from "@google-cloud/firestore";

function ping(ws: WebSocket) {
  console.log("INFO: ping...");
  ws.send(
    JSON.stringify({
      type: "PING",
    })
  );
}

export function initTwitchPubSub() {
  const pingInterval = 1000 * 60; //ms between PING's
  const reconnectInterval = 1000 * 3; //ms to wait before reconnect
  let pingHandle: NodeJS.Timeout;

  const ws = new WebSocket("wss://pubsub-edge.twitch.tv");

  ws.on("open", async function open() {
    console.log("INFO: Connected");

    const client = new Firestore();
    const document = await client.doc("integration/twitch").get();

    if (!document.data()) {
      throw new Error("Unable to load Twitch configuration from Firestore");
    }

    ws.send(
      JSON.stringify({
        type: "LISTEN",
        nonce: "44h1k13746815ab1r2",
        data: {
          topics: [
            `channel-points-channel-v1.${process.env.TWITCH_CHANNEL_ID}`,
          ],
          auth_token: document.data()?.access_token,
        },
      })
    );

    ping(ws);
    pingHandle = setInterval(() => ping(ws), pingInterval);
  });

  ws.on("close", function close() {
    console.log("INFO: Disconnected");
    clearInterval(pingHandle);
  });

  ws.on("message", function message(data: string) {
    const json = JSON.parse(data);

    if (json.type === "RESPONSE" && json.error === "ERR_BADAUTH") {
      console.log("ERROR: Invalid Twitch Token");
      process.exit(1);
    }

    if (json.type === "PONG") {
      console.log("INFO: ...pong");
    }

    if (json.type == "RECONNECT") {
      console.log("INFO: Reconnecting...");
      setTimeout(initTwitchPubSub, reconnectInterval);
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
      updateLightStatus({ on: false });

      setTimeout(() => {
        updateLightStatus({ on: true });
      }, 10 * 1000);
    }
  });
}
