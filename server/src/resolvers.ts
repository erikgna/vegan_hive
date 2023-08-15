import { GraphQLUpload } from "graphql-upload-minimal";

import { driver } from ".";
import { verifyToken } from "./firebase/config";
import { saveFile } from "./utils/saveFile";

export const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    checkIfUserLikedPost: async (_: any, args: any) => {
      const { authorEmail, postId } = args;
      const session = driver.session();

      try {
        const hasLike = await session.executeRead(async (tx) => {
          const query = `
            MATCH (:Post {postId: $postId})--(like:Like)
            MATCH (:User {email: $authorEmail})--(like2:Like)
            WITH COLLECT(like) AS postLikes, COLLECT(like2) AS userLikes
            RETURN [like IN postLikes WHERE like IN userLikes | like] AS commonLikes
        `;
          const params = {
            postId,
            authorEmail,
          };

          const result = await tx.run(query, params);
          const commonLikes = result.records[0].get("commonLikes");

          return commonLikes.length > 0;
        });

        return hasLike;
      } catch (error) {}
    },
  },

  Mutation: {
    createComment: async (_: any, args: any) => {
      const { content, authorEmail, postId } = args.input;
      const session = driver.session();

      try {
        const result = await session.executeWrite(async (transaction) => {
          const date = new Date().toISOString();
          const createCommentQuery = `
            MATCH (a:User {email: $authorEmail})
            CREATE (c:Comment {
              commentId: randomUUID(),
              content: $content,
              date: $date
            })-[:AUTHOR]->(a)
            RETURN c
          `;

          const createCommentParams = {
            content,
            authorEmail,
            date,
          };

          const commentResult = await transaction.run(
            createCommentQuery,
            createCommentParams
          );
          const commentNode = commentResult.records[0].get("c");

          // Query read user with email
          const readUserQuery = `
            MATCH (u:User {email: $authorEmail})
            RETURN u
            `;

          const readUserParams = {
            authorEmail,
          };

          const userResult = await transaction.run(
            readUserQuery,
            readUserParams
          );

          const userNode = userResult.records[0].get("u");
          commentNode.properties.author = userNode.properties;
          console.log(userNode.properties);
          const addCommentToPostQuery = `
            MATCH (p:Post {postId: $postId})
            MATCH (c:Comment {commentId: $commentId})
            CREATE (c)-[:COMMENT]->(p)
            RETURN c
          `;

          const addCommentToPostParams = {
            postId,
            commentId: commentNode.properties.commentId,
          };

          const commentWithRelationResult = await transaction.run(
            addCommentToPostQuery,
            addCommentToPostParams
          );

          const commentWithRelationNode =
            commentWithRelationResult.records[0].get("c");

          // Agora, relacione o autor ao Comment diretamente
          commentWithRelationNode.properties.author =
            commentNode.properties.author;

          return commentWithRelationNode.properties;
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

      const userInfo = await verifyToken(context.firebaseId);
      const session = driver.session();

      try {
        const result = await session.executeWrite(async (tx: any) => {
          const date = new Date().toISOString();
          const query = `
            MATCH (a:User {email: $authorEmail})
            CREATE (c:Post {
              postId: randomUUID(),
              imagePath: '',
              content: $content,
              likes: 0,
              date: $date
            })-[:AUTHOR]->(a)
            RETURN c
          `;

          const params = {
            content,
            authorEmail,
            date,
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
        session.close();
      } finally {
        session.close();
      }
    },

    likePost: async (_: any, args: any) => {
      const { postId, authorEmail } = args.input;
      const session = driver.session();

      try {
        const wasDeleted = await session.executeWrite(async (tx) => {
          const query = `
              MATCH (:Post {postId: '4a7659ae-5283-4feb-a81c-6932b3cbc28f'})--(like:Like)
              MATCH (:User {email: 'erikgnaa@gmail.com'})--(like2:Like)
              WITH COLLECT(like) AS postLikes, COLLECT(like2) AS userLikes
              WITH [like IN postLikes WHERE like IN userLikes | like] AS commonLikes
              UNWIND commonLikes AS likeToDelete
              DETACH DELETE likeToDelete
            `;
          const params = {
            authorEmail,
            postId,
          };

          const result = await tx.run(query, params);
          const counter =
            result.summary.counters.updates().nodesDeleted +
            result.summary.counters.updates().relationshipsDeleted;

          return counter > 0;
        });

        if (wasDeleted) {
          const decrementLikesQuery = `
              MATCH (p:Post {postId: $postId})
              SET p.likes = p.likes - 1
              RETURN p
        `;

          const decrementLikesParams = {
            postId,
          };

          await session.run(decrementLikesQuery, decrementLikesParams);
          return { result: "Deleted", likeId: "123" };
        }

        await session.executeWrite(async (transaction) => {
          const createLikeQuery = `
              MATCH (a:User {email: $authorEmail})
              MATCH (b:Post {postId: $postId})
              CREATE (c:Like {
                likeId: randomUUID()
              })-[:USER]->(a), (c)-[:POST]->(b)
              RETURN c
            `;

          const createLikeParams = {
            authorEmail,
            postId,
          };

          const likeResult = await transaction.run(
            createLikeQuery,
            createLikeParams
          );
          const likeNode = likeResult.records[0].get("c");

          const addLikeToPostQuery = `
              MATCH (p:Post {postId: $postId})
              MATCH (c:Like {likeId: $likeId})
              CREATE (c)-[:LIKE]->(p)
              RETURN c
            `;

          const addLikeToPostParams = {
            postId,
            likeId: likeNode.properties.likeId,
          };

          const likeWithRelationResult = await transaction.run(
            addLikeToPostQuery,
            addLikeToPostParams
          );

          const likeWithRelationNode =
            likeWithRelationResult.records[0].get("c");

          likeWithRelationNode.properties.author = likeNode.properties.author;

          const incrementLikesQuery = `
            MATCH (p:Post {postId: $postId})
            SET p.likes = p.likes + 1
            RETURN p
        `;

          const incrementLikesParams = {
            postId,
          };

          await transaction.run(incrementLikesQuery, incrementLikesParams);
        });

        return { result: "Created", likeId: "123" };
      } finally {
        session.close();
      }
    },
  },
};
