import { ConsoleLogDriver } from "../../../src/drivers/logger/ConsoleLogDriver";

describe("ConsoleLogDriver", () => {
  describe("#log", () => {
    it("uses the console.log method to write the message", async () => {
      const spy = jest.spyOn(console, "log");
      const subject = new ConsoleLogDriver();

      subject.log("ey!");

      expect(spy).toHaveBeenCalledWith("ey!");
    });
  });

  describe("#error", () => {
    it("uses the console.error method to write the message", async () => {
      const spy = jest.spyOn(console, "error");
      const subject = new ConsoleLogDriver();

      subject.error(new Error("ey!"));

      expect(spy).toHaveBeenCalledWith(new Error("ey!"));
    });
  });
});
