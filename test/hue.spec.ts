import { getPhilipsHueApi } from "../src/hue";
import { v3 } from "node-hue-api";
import RemoteBootstrap from "node-hue-api/lib/api/http/RemoteBootstrap";
import { Firestore } from "@google-cloud/firestore";
import { FirestoreStorageService } from "../src/services/storage/FirestoreStorageService";

describe("hue", () => {
  describe("#getPhilipsHueApi", () => {
    it("throws an error if there not 'HUE_CLIENT_ID' env var configured", () => {
      expect(async () => {
        await getPhilipsHueApi();
      }).rejects.toThrowError("Missing Philips Hue env configuration");
    });

    it("throws an error if there not 'HUE_CLIENT_SECRET' env var configured", () => {
      expect(async () => {
        await getPhilipsHueApi();
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
        await getPhilipsHueApi({ storageClient, hueClient });

        expect(hueClient.createRemote).toHaveBeenCalledWith(
          "HUE_CLIENT_ID",
          "HUE_CLIENT_SECRET"
        );
      });

      it("returns an error if we cannot find the access and refresh tokens using Firestore", async () => {
        data.mockImplementationOnce(() => null as any);

        expect(async () => {
          await getPhilipsHueApi({ storageClient, hueClient });
        }).rejects.toThrowError(
          "Unable to load Twitch configuration from Firestore"
        );
      });

      it("calls the 'connectWithTokens' method with the data from Firestore", async () => {
        data.mockImplementationOnce(() => ({
          access_token: "access",
          refresh_token: "refresh",
        }));

        await getPhilipsHueApi({ storageClient, hueClient });

        expect(connectWithTokens).toHaveBeenCalledWith("access", "refresh");
      });
    });
  });
});
