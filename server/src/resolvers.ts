import path, { resolve } from "path";
import fs, { createWriteStream, mkdir, unlink } from "fs";
import { GraphQLUpload } from "graphql-upload-minimal";
import { finished } from "stream";

import { driver } from ".";

export const resolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    createComment: async (_: any, args: any) => {
      const { content, authorId } = args.input;
      const session = driver.session();

      try {
        const result = await session.executeWrite((tx: any) =>
          tx.run(
            `
              MATCH (a:User {userId: $authorId})
              CREATE (c:Comment {
                commentId: randomUUID(),
                content: $content
              })-[:AUTHOR]->(a)
              RETURN c
            `,
            {
              content,
              authorId,
            }
          )
        );

        return result.records[0].get("c").properties;
      } finally {
        session.close();
      }
    },

    createPost: async (_: any, args: any) => {
      const { title, content, authorId } = args.input;
      const session = driver.session();

      try {
        const result = await session.executeWrite((tx: any) =>
          tx.run(
            `
                MATCH (a:User {userId: $authorId})
                CREATE (c:Post {
                  commentId: randomUUID(),
                  title: $title
                  content: $content
                })-[:AUTHOR]->(a)
                RETURN c
              `,
            {
              title,
              content,
              authorId,
            }
          )
        );

        return result.records[0].get("c").properties;
      } finally {
        session.close();
      }
    },

    likePost: async (_: any, args: any) => {
      const { postId, userId } = args.input;
      const session = driver.session();

      try {
        const result = await session.executeWrite((tx: any) =>
          tx.run(
            `
                MATCH (a:User {userId: $userId})
                MATCH (b:Post {postId: $postId})
                CREATE (c:Like {
                  likeId: randomUUID()                  
                })-[:USER, :POST]->(a, b)
                RETURN c
              `,
            {
              postId,
            }
          )
        );

        return result.records[0].get("c").properties;
      } finally {
        session.close();
      }
    },
    singleUpload: async (parent: any, { file }: any) => {
      try {
        const { createReadStream, filename, mimetype } = await file;

        console.log(filename);

        const bucketFolderPath = path.join(__dirname, "public");
        if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
          throw new Error(
            "Invalid file format. Only PNG and JPG images are supported."
          );
        }

        const filePath = path.join(bucketFolderPath, filename);

        const readStream = createReadStream();
        const writeStream = createWriteStream(filePath);

        writeStream.on("finish", resolve);

        writeStream.on("error", (error) => {
          unlink(filePath, () => {
            console.log(error);
          });
        });

        readStream.pipe(writeStream);

        return { filename, mimetype };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
