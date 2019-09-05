import * as config from "config";
import { createConnection } from "typeorm";
import * as Entities from "../../entities";

export default class Database {
  public static connect() {
    const options: any = Object.assign(JSON.parse(JSON.stringify(config.get("database"))), {
      logging: (config.get("server.logger") as boolean)
    });

    return createConnection({
      ...options,
      entities: Object.values(Entities)
    });
  }
}
