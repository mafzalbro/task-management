import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import express, { Request } from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { typeDefs } from "./interfaces/graphql/schemas/index.js";
import { resolvers } from "./interfaces/graphql/resolvers/index.js";

dotenv.config();

const authConfig = {
  domain: process.env.AUTH0_DOMAIN || "your-domain.auth0.com",
  audience: process.env.AUTH0_AUDIENCE || "your-api-identifier",
};

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }) as any,
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
  credentialsRequired: false,
});

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Handle subscriptions with graphql-ws
  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        console.log("WS Connected");
      },
      onDisconnect(ctx, code, reason) {
        console.log("WS Disconnected");
      },
    },
    wsServer,
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    checkJwt,
    expressMiddleware(server, {
      context: async ({ req }: { req: any }) => {
        return { userId: req.auth?.sub || "guest-user", user: req.auth };
      },
    }),
  );

  const PORT = process.env.PORT || 3000;

  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.warn("Could not connect to MongoDB, proceeding without DB:", err);
    }
  }

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
