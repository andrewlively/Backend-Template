import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

export class PingRoute {

  constructor(fastify: FastifyInstance) {
    fastify.route({
      handler: this.ping,
      method: "GET",
      schema: {
        response: {
          200: {
            properties: {
              ping: { type: "string" }
            },
            type: "object",
          }
        }
      },
      url: "/ping"
    });
  }

  private ping(
    request: FastifyRequest<IncomingMessage>,
    reply: FastifyReply<ServerResponse>
  ) {
    reply
      .code(200)
      .send({ ping: "pong" });
  }

}