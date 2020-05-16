import { Firestore, FieldValue } from "@google-cloud/firestore";

export const setup = async () => {
  const client = new Firestore();

  if (process.env.TWITCH_TOKEN) {
    try {
      await client.doc("integration/twitch").create({
        access_token: process.env.TWITCH_TOKEN || FieldValue.delete(),
        refresh_token: process.env.TWITCH_REFRESH_TOKEN || FieldValue.delete(),
      });
    } catch (e) {
      console.error(
        "ERROR: Unable to create Twitch configuration in Firestore"
      );
    }
  }

  if (process.env.HUE_TOKEN) {
    try {
      await client.doc("integration/hue").create({
        access_token: process.env.HUE_TOKEN || FieldValue.delete(),
        refresh_token: process.env.HUE_REFRESH_TOKEN || FieldValue.delete(),
      });
    } catch (e) {
      console.error("ERROR: Unable to create Hue configuration in Firestore");
    }
  }
};
