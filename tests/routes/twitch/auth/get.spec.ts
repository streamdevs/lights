import { getConfiguration } from "../../../../src/config";
import { initServer } from "../../../../src/server";

describe("GET /twitch/auth", () => {
  it("redirects the user to the expect Twitch Authorization page", async () => {
    const subject = initServer();
    const { clientId, scopes, redirectUri } = getConfiguration().twitch;

    const { headers } = await subject.inject({
      method: "GET",
      url: "/twitch/auth",
    });

    expect(headers).toEqual(
      expect.objectContaining({
        location: `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`,
      })
    );
  });
});
