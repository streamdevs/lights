import { DriverFactory } from "@streamdevs/lights-lul";
import { FakeHttpDriver } from "@streamdevs/lights-lul";
import { initServer } from "../../../../../src/server";

const testBuilder = () => {
  const code = "blabla";
  const fake = new FakeHttpDriver();
  fake.post.mockImplementationOnce(async () => ({
    access_token: "<user access token>",
    refresh_token: "<refresh token>",
    expires_in: 10,
  }));
  jest.spyOn(DriverFactory, "build").mockImplementationOnce(() => fake);
  const subject = initServer();

  return { subject, code };
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
});
