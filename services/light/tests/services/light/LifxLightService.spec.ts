import { getConfiguration } from "../../../src/config";
import { FakeHttpDriver } from "../../../src/drivers/FakeHttpDriver";
import { LifxLightService } from "../../../src/services/light/LifxLightService";
import { LightBuilder } from "../../builders/LightBuilder";

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

    it("calls the LIFX API with the given color and duration", async () => {
      const driver = new FakeHttpDriver();
      const subject = new LifxLightService(driver);
      const light = LightBuilder.build({ service: "LIFX" });

      await subject.changeColor(light, { color: "green", duration: 10 });

      expect(driver.put).toHaveBeenCalledWith(
        `https://api.lifx.com/v1/lights/${light.id}/state`,
        {
          payload: { color: "green", duration: 10 },
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
});
