import { DateTime } from "luxon";
import { getConfiguration } from "../../config";
import { DriverFactory } from "../../drivers/DriverFactory";
import { HttpDriver } from "../../drivers/HttpDriver";
import { StorageFactory } from "../../services/storage/StorageFactory";
import { StorageService } from "../../services/storage/StorageService";

interface PerformOptions {
  code: string;
}

export class TwitchAuthCallback {
  public constructor(
    private driver: HttpDriver = DriverFactory.build(),
    private storageService: StorageService = StorageFactory.build()
  ) {}

  public async perform({ code }: PerformOptions) {
    const { clientId, clientSecret, redirectUri } = getConfiguration().twitch;

    const response = await this.driver.post(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}`,
      {}
    );

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = response;

    const expiryDate = DateTime.local()
      .plus({
        seconds: expiresIn,
      })
      .toJSDate();

    await this.storageService.set("services/twitch", {
      accessToken,
      refreshToken,
      expiresIn,
      expiryDate,
    });
  }
}
