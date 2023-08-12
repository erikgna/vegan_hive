import { Neo4jGraphQL } from "@neo4j/graphql";
import { ApolloServer } from "apollo-server-express";
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import http from "http";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import express from "express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";

import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";

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
  app.use(graphqlUploadExpress({ maxFileSize: 6000000, maxFiles: 1 }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const schema = await neoSchema.getSchema();

  const server = new ApolloServer({
    schema,
    cache: "bounded",
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

startApolloServer();
