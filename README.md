# 💡💡 lights ![ci](https://github.com/streamdevs/lights/workflows/ci/badge.svg)

> Let your streaming control your Lifx and Philips Hue lights 🙈

## How to setup

Copy the .env.example file and complete the required values.

```
cp .env.example .env
```

| Env var                         | Description                                                                             | Required |
| ------------------------------- | --------------------------------------------------------------------------------------- | -------- |
| TWITCH_CHANNEL_ID               | Your [Twitch Channel Id](https://dev.twitch.tv/docs/v5/reference/channels/#get-channel) | **true** |
| TWITCH_CLIENT_ID                | Your Twitch Client ID                                                                   | **true** |
| TWITCH_CLIENT_SECRET            | Your Twitch Client Secret                                                               | **true** |
| APP_GOOGLE_CLOUD_SERVICE        | The name of the AppEngine Service that is running the app                               | **true** |
| APP_GOOGLE_CLOUD_QUEUE          | The name of the Google Cloud Task queue which will handle the requests                  | **true** |
| APP_GOOGLE_CLOUD_QUEUE_LOCATION | The location of the Google Cloud Task queue which will handle the requests              | **true** |

## License

This project is under the [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) license
