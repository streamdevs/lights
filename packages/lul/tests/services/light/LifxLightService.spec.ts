import { FakeHttpDriver } from "../../../src";
import { getConfiguration } from "../../../src/config";
import { LifxLightService } from "../../../src/services/light/LifxLightService";
import { wait } from "../../../src/utils/wait";
import { LightBuilder } from "../../builders/LightBuilder";

jest.mock("../../../src/utils/wait", () => ({
  wait: jest.fn(() => Promise.resolve()),
}));

describe("LifxLightService", () => {
  describe("#turnOff", () => {
    it("calls the LIFX api route with to set the 'power' to 'off'", async () => {
      const driver = new FakeHttpDriver();
      const light = LightBuilder.build({ service: "LIFX" });
      const subject = new LifxLightService(driver);

      await subject.turnOff(light);

      expect(driver.put).toHaveBeenCalledWith(
        `https://api.lifx.com/v1/lights/${light.id}/state`,
        {
          payload: { power: "off" },
          headers: {
            Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
          },
        }
      );
    });

    it("throws the error if the driver fails", async () => {
      const driver = new FakeHttpDriver();
      driver.put.mockImplementation(() => {
        throw new Error("Boom!");
      });
      const light = LightBuilder.build({ service: "LIFX" });
      const subject = new LifxLightService(driver);

      await expect(subject.turnOff(light)).rejects.toThrow(new Error("Boom!"));
    });
  });

  describe("#turnOn", () => {
    it("calls the LIFX api route with to set the 'power' to 'on'", async () => {
      const driver = new FakeHttpDriver();
      const light = LightBuilder.build({ service: "LIFX" });
      const subject = new LifxLightService(driver);

      await subject.turnOn(light);

      expect(driver.put).toHaveBeenCalledWith(
        `https://api.lifx.com/v1/lights/${light.id}/state`,
        {
          payload: { power: "on", brightness: 1 },
          headers: {
            Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
          },
        }
      );
    });

    it("throws the error if the driver fails", async () => {
      const driver = new FakeHttpDriver();
      driver.put.mockImplementation(() => {
        throw new Error("Boom!");
      });
      const light = LightBuilder.build({ service: "LIFX" });
      const subject = new LifxLightService(driver);

      await expect(subject.turnOn(light)).rejects.toThrow(new Error("Boom!"));
    });
  });

  describe("#changeColor", () => {
    it("calls the LIFX API with the given color", async () => {
      const driver = new FakeHttpDriver();
      const subject = new LifxLightService(driver);
      const light = LightBuilder.build({ service: "LIFX" });

      await subject.changeColor(light, { color: "green" });

      expect(driver.put).toHaveBeenCalledWith(
        `https://api.lifx.com/v1/lights/${light.id}/state`,
        {
          payload: { color: "green" },
          headers: {
            Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
          },
        }
      );
    });

    it("calls the LIFX API with the given color, waits the specified duration and set the default color", async () => {
      const driver = new FakeHttpDriver();
      const subject = new LifxLightService(driver);
      const light = LightBuilder.build({ service: "LIFX" });

      await subject.changeColor(light, { color: "green", duration: 10 });

      expect(driver.put).toHaveBeenCalledWith(
        `https://api.lifx.com/v1/lights/${light.id}/state`,
        {
          payload: { color: "green" },
          headers: {
            Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
          },
        }
      );
      expect(wait).toHaveBeenCalledWith(10);
      expect(driver.put).toHaveBeenCalledWith(
        `https://api.lifx.com/v1/lights/${light.id}/state`,
        {
          payload: {
            color: {
              hue: 312.8027,
              saturation: 0,
              kelvin: 3720,
            },
          },
          headers: {
            Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
          },
        }
      );
    });

    it("throws the error if the driver fails", async () => {
      const driver = new FakeHttpDriver();
      driver.put.mockImplementation(() => {
        throw new Error("Boom!");
      });
      const light = LightBuilder.build({ service: "LIFX" });
      const subject = new LifxLightService(driver);

      await expect(
        subject.changeColor(light, { color: "green" })
      ).rejects.toThrow(new Error("Boom!"));
    });
  });

  describe("#disco", () => {
    it("calls the LIFX API with the color, cycles, period and lights", async () => {
      const driver = new FakeHttpDriver();
      const subject = new LifxLightService(driver);
      const light = LightBuilder.build({ service: "LIFX" });

      await subject.disco(light, { color: "red", cycles: 5, period: 5 });

      expect(driver.post).toHaveBeenCalledWith(
        `https://api.lifx.com/v1/lights/id:${light.id}/effects/breathe`,
        {
          payload: { color: "red", cycles: 5, period: 5 },
          headers: { Authorization: "Bearer fake-lifx-token" },
        }
      );
    });

    it("calls the LIFX API with the initialColor, color, cycles, period and lights", async () => {
      const driver = new FakeHttpDriver();
      const subject = new LifxLightService(driver);
      const light = LightBuilder.build({ service: "LIFX" });

      await subject.disco(light, {
        color: "red",
        cycles: 5,
        period: 5,
        initialColor: "blue",
      });

      expect(driver.post).toHaveBeenCalledWith(
        `https://api.lifx.com/v1/lights/id:${light.id}/effects/breathe`,
        {
          payload: { color: "red", cycles: 5, period: 5, from_color: "blue" },
          headers: { Authorization: "Bearer fake-lifx-token" },
        }
      );
    });

    it("throws the error if the driver fails", async () => {
      const driver = new FakeHttpDriver();
      driver.post.mockImplementation(() => {
        throw new Error("Boom!");
      });
      const light = LightBuilder.build({ service: "LIFX" });
      const subject = new LifxLightService(driver);

      await expect(
        subject.disco(light, {
          color: "red",
          cycles: 5,
          period: 5,
          initialColor: "blue",
        })
      ).rejects.toThrow(new Error("Boom!"));
    });
  });
});
