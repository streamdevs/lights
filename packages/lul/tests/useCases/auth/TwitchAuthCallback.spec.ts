import { DateTime } from "luxon";
import { FakeHttpDriver } from "../../../src";
import { getConfiguration } from "../../../src/config";
import { FakeStorageService } from "../../../src/services/storage/FakeStorageService";
import { TwitchAuthCallback } from "../../../src/useCases/auth/TwitchAuthCallback";

const testBuilder = () => {
  const driver = new FakeHttpDriver();
  driver.post.mockImplementationOnce(async () => ({
    access_token: "<user access token>",
    refresh_token: "<refresh token>",
    expires_in: 10,
  }));

  const storageService = new FakeStorageService();
  const subject = new TwitchAuthCallback(driver, storageService);

  return { driver, subject, storageService };
};

describe("TwitchAuthCallback", () => {
  it("calls Twitch API to get the access and refresh tokens", async () => {
    const { driver, subject } = testBuilder();
    const code = "code";
    const { clientId, clientSecret, redirectUri } = getConfiguration().twitch;

    await subject.perform({ code });

    expect(driver.post).toHaveBeenCalledWith(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}`,
      {}
    );
  });

  it("stores the access and refresh tokens using the StorageService", async () => {
    const { subject, storageService } = testBuilder();

    await subject.perform({ code: "code" });

    expect(storageService.set).toHaveBeenCalledWith("services/twitch", {
      accessToken: "<user access token>",
      refreshToken: "<refresh token>",
      expiresIn: 10,
      expiryDate: expect.any(Date),
    });
  });

  it("stores expiryDate as the current date + expiresIn", async () => {
    const { subject, storageService } = testBuilder();
    const currentDate = DateTime.local();
    jest.spyOn(DateTime, "local").mockReturnValue(currentDate);

    await subject.perform({ code: "code" });

    expect(storageService.set).toHaveBeenCalledWith("services/twitch", {
      accessToken: "<user access token>",
      refreshToken: "<refresh token>",
      expiresIn: 10,
      expiryDate: currentDate.plus({ seconds: 10 }).toJSDate(),
    });
  });
});
