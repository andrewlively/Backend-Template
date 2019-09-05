import * as Sentry from "@sentry/node";
import * as config from "config";
import * as Fastify from "fastify";
import * as FastifyFormbody from "fastify-formbody";
import * as FastifyHelmet from "fastify-helmet";
import * as FastifySwagger from "fastify-swagger";
import { ExceptionReporter } from "./utils/ExceptionReporter";
import { Logger } from "./utils/Logger";
import Database from "./utils/Database";
import { Routes } from "./routes";

const pkg = require("../package.json");

const main = async () => {
  const logger = new Logger();

  try {
    // Get the Sentry DSN
    const sentryDSN: string = config.get("sentry");

    // If a DSN is provided, initialize Sentry
    if (sentryDSN) {
      Sentry.init({ dsn: sentryDSN });
    }

    // Connect the database
    // await Database.connect();

    // Create fastify instance
    const fastify = Fastify({
      logger: config.get("server.logger")
    });

    fastify.register(FastifyFormbody); // Handles "application/x-www-form-urlencoded" body requests
    fastify.register(FastifyHelmet); // Appies security related headers

    // Get swagger info from config
    const swaggerConfig: { enabled: boolean, options: { routePrefix: string, swagger: any } } = config.get("swagger");

    if (swaggerConfig && swaggerConfig.enabled) {
      fastify.register(FastifySwagger, {
        exposeRoute: true,
        routePrefix: "/_docs",
        swagger: {
          ...Object.assign(JSON.parse(JSON.stringify(swaggerConfig.options)), { // Exposes a "/_docs" swagger endpoint
            ...swaggerConfig.options,
            version: pkg.version
          })
        },
      });
    }

    for (let route of Routes) {
      new route(fastify);
    }


    fastify.ready((err: Error) => {
      if (err) { throw err; }

      if (swaggerConfig && swaggerConfig.enabled) {
        fastify.swagger();
      }
    });

    // Start listening
    fastify.listen(config.get("server.port"), config.get("server.host"), (err: Error, address: string) => {
      if (!err) { return; }

      /**
       * Something failed in the Fastify start listening. Usually this is because it cannot bind to the port (probably already in use).
       * Report it and kill this process
       * */
      new ExceptionReporter().report(err);

      process.exit(1);
    });
  } catch (error) {
    // Something failed in the server startup. Report it and kill this process
    logger.fatal(error);

    process.exit(1);
  }
}

main(); // Start the server
