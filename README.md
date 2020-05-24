# 💡💡 lights

> Let your streaming control your Philips Hue lights 🙈

## How to setup

Copy the .env.example file and complete the required values.

```
cp .env.example .env
```

| Env var           | Description                                                                                                                               | Required |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| TWITCH_CHANNEL_ID | Your [Twitch Channel Id](https://dev.twitch.tv/docs/v5/reference/channels/#get-channel)                                                   | **true** |
| TWITCH_TOKEN      | Your [Twitch Access Token](https://dev.twitch.tv/docs/authentication#getting-tokens) with **channel:read:redemptions** scope              | **true** |
| TWITCH_REWARD_ID  | The id of the reward you want to use as a trigger                                                                                         | **true** |
| HUE_CLIENT_ID     | The client id from a [Philips Hue Remote](https://developers.meethue.com/develop/hue-api/remote-api-quick-start-guide/)                   | **true** |
| HUE_CLIENT_SECRET | The client secret from a [Philips Hue Remote](https://developers.meethue.com/develop/hue-api/remote-api-quick-start-guide/)               | **true** |
| HUE_TOKEN         | The [hue access token](https://developers.meethue.com/develop/hue-api/remote-authentication/) generated with the same Philips Hue Remote  | **true** |
| HUE_REFRESH_TOKEN | The [hue refresh token](https://developers.meethue.com/develop/hue-api/remote-authentication/) generated with the same Philips Hue Remote | **true** |
| HUE_LIGHTS        | A comma separated string with the ids of the lights you want to let your streaming to turn off/on                                         | **true** |

## License

This project is under the [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) license