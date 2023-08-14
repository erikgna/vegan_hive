import { GraphQLUpload } from "graphql-upload-minimal";

import { driver } from ".";
import { verifyToken } from "./firebase/config";
import { saveFile } from "./utils/saveFile";

export const resolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    createComment: async (_: any, args: any) => {
      const { content, authorEmail, postId } = args.input;
      const session = driver.session();

      try {
        const result = await session.executeWrite(async (tx: any) => {
          const createCommentQuery = `
            MATCH (a:User {email: $authorEmail})
            CREATE (c:Comment {
              commentId: randomUUID(),
              content: $content
            })-[:AUTHOR]->(a)
            RETURN c
          `;

          const createCommentParams = {
            content,
            authorEmail,
          };

          const commentResult = await tx.run(
            createCommentQuery,
            createCommentParams
          );
          const commentProperties =
            commentResult.records[0].get("c").properties;

          const addCommentToPostQuery = `
            MATCH (p:Post {postId: $postId})
            MATCH (c:Comment {commentId: $commentId})
            CREATE (c)-[:COMMENT]->(p)
          `;

          const addCommentToPostParams = {
            postId,
            commentId: commentProperties.commentId,
          };

          await tx.run(addCommentToPostQuery, addCommentToPostParams);

          return commentProperties;
        });

        return result;
      } finally {
        session.close();
      }
    },

    createUser: async (_: any, args: any, context: any) => {
      const { username, email } = args.input;

      const session = driver.session();
      try {
        const result = await session.executeWrite(async (tx: any) => {
          const query = `            
            CREATE (c:User {
              userId: randomUUID(),
              username: $username,
              email: $email
            })
            RETURN c
          `;

          const params = {
            username,
            email,
          };

          const result = await tx.run(query, params);

          return result.records[0].get("c").properties;
        });

        return result;
      } catch (e) {
        session.close();
      } finally {
        session.close();
      }
    },

    createPost: async (_: any, args: any, context: any) => {
      const { content, authorEmail, file } = args.input;
      console.log("teste");
      const userInfo = await verifyToken(context.firebaseId);
      const session = driver.session();

      try {
        const result = await session.executeWrite(async (tx: any) => {
          const query = `
            MATCH (a:User {email: $authorEmail})
            CREATE (c:Post {
              postId: randomUUID(),
              imagePath: '',
              content: $content,
              likes: 0,
              date: datetime()
            })-[:AUTHOR]->(a)
            RETURN c
          `;

          const params = {
            content,
            authorEmail,
          };

          const result = await tx.run(query, params);
          const properties = result.records[0].get("c").properties;

          const path = `${userInfo.user_id}/posts/${properties.postId}`;
          const filePath = await saveFile(file, path);

          const updateQuery = `
            MATCH (p:Post {postId: $postId})
            SET p.imagePath = $imagePath
            RETURN p
          `;

          const updateParams = {
            postId: properties.postId,
            imagePath: filePath,
          };

          await tx.run(updateQuery, updateParams);

          return { properties, filePath };
        });

        return result;
      } catch (e) {
        console.log(e);
        session.close();
      } finally {
        session.close();
      }
    },

    likePost: async (_: any, args: any) => {
      const { postId, authorEmail } = args.input;
      const session = driver.session();

      try {
        const existingLike = await session.readTransaction(async (tx: any) => {
          const query = `
            MATCH (u:User {email: $authorEmail})-[:USER]->(like:Like)-[:POST]->(p:Post {postId: $postId})
            RETURN like
          `;

          const params = {
            authorEmail,
            postId,
          };

          const result = await tx.run(query, params);

          return result.records[0]?.get("like");
        });

        if (existingLike) {
          await session.writeTransaction(async (tx: any) => {
            const deleteQuery = `
              MATCH (u:User {email: $authorEmail})-[:USER]->(like:Like)-[:POST]->(p:Post {postId: $postId})
              DELETE like
            `;

            const deleteParams = {
              authorEmail,
              postId,
            };

            await tx.run(deleteQuery, deleteParams);

            const updatePostLikesQuery = `
              MATCH (p:Post {postId: $postId})
              SET p.likes = p.likes - 1
              RETURN p.likes
            `;

            const updatePostLikesParams = {
              postId,
            };

            await tx.run(updatePostLikesQuery, updatePostLikesParams);
          });
        } else {
          const result = await session.writeTransaction(async (tx: any) => {
            const createQuery = `
              MATCH (a:User {email: $authorEmail})
              MATCH (b:Post {postId: $postId})
              CREATE (c:Like {
                likeId: randomUUID()                  
              })-[:USER, :POST]->(a, b)
              RETURN c
            `;

            const createParams = {
              postId,
              authorEmail,
            };

            await tx.run(createQuery, createParams);

            const updatePostLikesQuery = `
              MATCH (p:Post {postId: $postId})
              SET p.likes = p.likes + 1
              RETURN p.likes
            `;

            const updatePostLikesParams = {
              postId,
            };

            const updateResult = await tx.run(
              updatePostLikesQuery,
              updatePostLikesParams
            );
            const newLikesCount = updateResult.records[0].get("p.likes");

            return { likes: newLikesCount };
          });

          return result;
        }
      } finally {
        session.close();
      }
    },
  },
};
