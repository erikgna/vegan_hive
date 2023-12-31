import { Neo4jGraphQL } from "@neo4j/graphql";
import { ApolloServer } from "apollo-server-express";
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import http from "http";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import express from "express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import cors from "cors";

import { typeDefs } from "./graphql/schemas";
import { resolvers } from "./graphql/resolvers";
import { OGM } from "@neo4j/graphql-ogm";
import "./firebase/config";

dotenv.config();

export const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

const startApolloServer = async () => {
  const neoSchema = new Neo4jGraphQL({ typeDefs, driver, resolvers });

  const app = express();
  const httpServer = http.createServer(app);

  app.use("/public", express.static("public"));
  app.use(
    cors<cors.CorsRequest>({
      origin: [process.env.WEB_DEPLOY_URL!, process.env.WEB_LOCALHOST_URL!],
    })
  );
  app.use(graphqlUploadExpress({ maxFileSize: 6000000, maxFiles: 1 }));

  const schema = await neoSchema.getSchema();

  const server = new ApolloServer({
    schema,
    cache: "bounded",
    csrfPrevention: false,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageDisabled(),
    ],
    context: ({ req }) => {
      const token = req.headers.authorization || "";

      return {
        firebaseId: token,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

export const ogm = new OGM({ typeDefs, driver });

startApolloServer();
