import * as config from "config";
import * as Pino from "pino";

export class Logger {

  private logger: Pino.Logger;

  constructor() {
    if (!config.get("server.logger")) { return; }

    this.logger = Pino();
  }

  public info(message: string): void {
    if (!this.logger) { return; }

    this.logger.info(message);
  }

  public warn(message: string): void {
    if (!this.logger) { return; }

    this.logger.warn(message);
  }

  public error(message: string): void {
    if (!this.logger) { return; }

    this.logger.error(message);
  }

  public fatal(message: string): void {
    if (!this.logger) { return; }

    this.logger.fatal(message);
  }

}
