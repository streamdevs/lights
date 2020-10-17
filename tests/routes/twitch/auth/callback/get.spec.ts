import { Firestore } from "@google-cloud/firestore";
import nock from "nock";
import { getConfiguration } from "../../../../../src/config";
import { initServer } from "../../../../../src/server";
import { FirestoreStorageService } from "../../../../../src/services/storage/FirestoreStorageService";

const testBuilder = () => {
  const { clientId, clientSecret, redirectUri } = getConfiguration().twitch;
  const storageSpy = jest.spyOn(FirestoreStorageService.prototype, "set");
  storageSpy.mockImplementationOnce(async () => {});
  const code = "blabla";
  const scope = nock("https://id.twitch.tv")
    .post("/oauth2/token")
    .query({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    })
    .once()
    .reply(200, {
      access_token: "<user access token>",
      refresh_token: "<refresh token>",
      expires_in: 9084530985409865098,
      scope: ["<your previously listed scope(s)>"],
      token_type: "bearer",
    });
  const subject = initServer();

  return { subject, code, scope, storageSpy };
};

describe("GET /twitch/auth/callback", () => {
  it("handles the callback", async () => {
    const { subject, code } = testBuilder();

    const { statusCode } = await subject.inject({
      method: "GET",
      url: `/twitch/auth/callback?code=${code}`,
    });

    expect(statusCode).toEqual(200);
  });

  it("rejects request without code in the query string", async () => {
    const subject = initServer();

    const { statusCode } = await subject.inject({
      method: "GET",
      url: "/twitch/auth/callback",
    });

    expect(statusCode).toEqual(400);
  });

  it("calls twitch to get the access and refresh tokens", async () => {
    const { subject, code, scope } = testBuilder();

    await subject.inject({
      method: "GET",
      url: `/twitch/auth/callback?code=${code}`,
    });

    expect(scope.isDone()).toBe(true);
  });

  it("stores access and refresh tokens in our database using the StorageService", async () => {
    const { subject, code, storageSpy } = testBuilder();

    await subject.inject({
      method: "GET",
      url: `/twitch/auth/callback?code=${code}`,
    });

    expect(storageSpy).toHaveBeenCalledWith("services/twitch", {
      accessToken: "<user access token>",
      refreshToken: "<refresh token>",
      expiresIn: 9084530985409865098,
    });
  });
});
