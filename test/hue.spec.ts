import * as hue from "../src/hue";
import { v3 } from "node-hue-api";
import RemoteBootstrap from "node-hue-api/lib/api/http/RemoteBootstrap";
import { Firestore } from "@google-cloud/firestore";
import { FirestoreStorageService } from "../src/services/storage/FirestoreStorageService";

describe("hue", () => {
  describe("#getPhilipsHueApi", () => {
    it("throws an error if there not 'HUE_CLIENT_ID' env var configured", () => {
      expect(async () => {
        await hue.getPhilipsHueApi();
      }).rejects.toThrowError("Missing Philips Hue env configuration");
    });

    it("throws an error if there not 'HUE_CLIENT_SECRET' env var configured", () => {
      expect(async () => {
        await hue.getPhilipsHueApi();
      }).rejects.toThrowError("Missing Philips Hue env configuration");
    });

    describe("with client id and client secret", () => {
      let connectWithTokens: any;
      let remote: RemoteBootstrap;
      let data: any;
      let get: any;
      let doc: any;
      let storageClient: FirestoreStorageService;
      let hueClient: typeof v3.api;

      beforeEach(() => {
        hueClient = ({
          createRemote: jest.fn(() => remote),
        } as unknown) as typeof v3.api;

        connectWithTokens = jest.fn();
        remote = ({
          connectWithTokens,
        } as unknown) as RemoteBootstrap;
        data = jest.fn(() => ({ access_token: "", refresh_token: "" }));
        get = jest.fn(() => ({
          data,
        }));
        doc = jest.fn(() => ({
          get,
        }));
        const client = ({
          doc,
        } as unknown) as Firestore;
        storageClient = new FirestoreStorageService(client);

        process.env.HUE_CLIENT_ID = "HUE_CLIENT_ID";
        process.env.HUE_CLIENT_SECRET = "HUE_CLIENT_SECRET";
      });

      afterEach(() => {
        delete process.env.HUE_CLIENT_ID;
        delete process.env.HUE_CLIENT_SECRET;
      });

      it("calls createRemote with the 'HUE_CLIENT_ID' and 'HUE_CLIENT_SECRET' env var values", async () => {
        await hue.getPhilipsHueApi({ storageClient, hueClient });

        expect(hueClient.createRemote).toHaveBeenCalledWith(
          "HUE_CLIENT_ID",
          "HUE_CLIENT_SECRET"
        );
      });

      it("returns an error if we cannot find the access and refresh tokens using Firestore", async () => {
        data.mockImplementationOnce(() => null as any);

        expect(async () => {
          await hue.getPhilipsHueApi({ storageClient, hueClient });
        }).rejects.toThrowError(
          "Unable to load Twitch configuration from Firestore"
        );
      });

      it("calls the 'connectWithTokens' method with the data from Firestore", async () => {
        data.mockImplementationOnce(() => ({
          access_token: "access",
          refresh_token: "refresh",
        }));

        await hue.getPhilipsHueApi({ storageClient, hueClient });

        expect(connectWithTokens).toHaveBeenCalledWith("access", "refresh");
      });
    });
  });

  describe("#updateLightStatus", () => {
    it("calls the Philips Hue api with the default status and light id", async () => {
      const setLightState = jest.fn();
      jest
        .spyOn(hue, "getPhilipsHueApi")
        .mockImplementationOnce(
          async () => ({ lights: { setLightState } } as any)
        );
      process.env.HUE_LIGHTS = "9";

      await hue.updateLightStatus();

      expect(setLightState).toHaveBeenCalledWith("9", { on: false });
    });

    it("calls the Philips Hue api with the given status and light id", async () => {
      const setLightState = jest.fn();
      jest
        .spyOn(hue, "getPhilipsHueApi")
        .mockImplementationOnce(
          async () => ({ lights: { setLightState } } as any)
        );
      process.env.HUE_LIGHTS = "9";

      await hue.updateLightStatus({ on: true });

      expect(setLightState).toHaveBeenCalledWith("9", { on: true });
    });
  });

  describe("#refreshHueTokens", () => {
    const client = ({
      get: jest.fn(),
      set: jest.fn(),
    } as unknown) as FirestoreStorageService;
    let tokens: any;

    beforeEach(() => {
      tokens = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        refreshTokenExpiresAt: "refreshTokenExpiresAt",
        accessTokenExpiresAt: "accessTokenExpiresAt",
      };
      jest
        .spyOn(hue, "getPhilipsHueApi")
        .mockImplementationOnce(
          async () =>
            ({ remote: { refreshTokens: jest.fn(async () => tokens) } } as any)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("logs that we don't need to refresh the hue token", async () => {
      jest.spyOn(Date, "now").mockReturnValueOnce(-1);
      jest
        .spyOn(client, "get")
        .mockReturnValueOnce(Promise.resolve({ access_token_expire_at: 0 }));
      const spyConsole = jest.spyOn(console, "log");

      await hue.refreshHueTokens({ client });

      expect(spyConsole).toHaveBeenCalledWith("INFO: skip hue token refresh");
    });

    it("logs that we try to refresh the hue token", async () => {
      jest.spyOn(Date, "now").mockReturnValueOnce(1);
      jest
        .spyOn(client, "get")
        .mockReturnValueOnce(Promise.resolve({ access_token_expire_at: 0 }));
      const spyConsole = jest.spyOn(console, "log");

      await hue.refreshHueTokens({ client });

      expect(spyConsole).toHaveBeenCalledWith(
        "INFO: refreshing new hue tokens"
      );
    });

    it("calls the 'FirestoreStorage' with the new tokens", async () => {
      jest.spyOn(Date, "now").mockReturnValueOnce(1);
      jest
        .spyOn(client, "get")
        .mockReturnValueOnce(Promise.resolve({ access_token_expire_at: 0 }));

      await hue.refreshHueTokens({ client });

      expect(client.set).toHaveBeenCalledWith("integration/hue", {
        access_token: tokens.accessToken,
        access_token_expire_at: tokens.accessTokenExpiresAt,
        refresh_token: tokens.refreshToken,
        refresh_token_expires_at: tokens.refreshTokenExpiresAt,
      });
    });
  });
});