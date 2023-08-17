import { driver, ogm } from "../..";

import { Model } from "@neo4j/graphql-ogm";

const typeDefs = `
    type Like {
      likeId: ID! @id
      post: Post! @relationship(type: "POST", direction: OUT)
      user: User! @relationship(type: "USER", direction: OUT)
    }
`;
export class LikeResolver {
  checkIfUserLikedPost = async (_: any, args: any) => {
    await ogm.init();
    const Like = ogm.model("Like");

    const likes = await Like.find({
      where: {
        post: {
          postId: args.postId,
        },
        user: {
          email: args.authorEmail,
        },
      },
    });

    console.log(likes);

    // const { authorEmail, postId } = args;
    // const session = driver.session();
    // try {
    //   const hasLike = await session.executeRead(async (tx) => {
    //     const query = `
    //           MATCH (:Post {postId: $postId})--(like:Like)
    //           MATCH (:User {email: $authorEmail})--(like2:Like)
    //           WITH COLLECT(like) AS postLikes, COLLECT(like2) AS userLikes
    //           RETURN [like IN postLikes WHERE like IN userLikes | like] AS commonLikes
    //       `;
    //     const params = {
    //       postId,
    //       authorEmail,
    //     };
    //     const result = await tx.run(query, params);
    //     const commonLikes = result.records[0].get("commonLikes");
    //     return commonLikes.length > 0;
    //   });
    //   return hasLike;
    // } catch (error) {}
  };
  likePost = async (_: any, args: any) => {
    console.log(args.input.postId, args.input.authorEmail);
    await ogm.init();
    const Like = ogm.model("Like");

    const data = await Like.create({
      input: [
        {
          post: {
            connect: {
              where: {
                postId: args.input.postId,
              },
            },
          },
          user: {
            connect: {
              where: {
                email: args.input.authorEmail,
              },
            },
          },
        },
      ],
    });

    console.log(data);
    // const { postId, authorEmail } = args.input;
    // const session = driver.session();

    // try {
    //   const wasDeleted = await session.executeWrite(async (tx) => {
    //     const query = `
    //         MATCH (:Post {postId: $postId})--(like:Like)
    //         MATCH (:User {email: $authorEmail})--(like2:Like)
    //         WITH COLLECT(like) AS postLikes, COLLECT(like2) AS userLikes
    //         WITH [like IN postLikes WHERE like IN userLikes | like] AS commonLikes
    //         UNWIND commonLikes AS likeToDelete
    //         DETACH DELETE likeToDelete
    //       `;
    //     const params = {
    //       postId,
    //       authorEmail,
    //     };

    //     const result = await tx.run(query, params);
    //     const counter =
    //       result.summary.counters.updates().nodesDeleted +
    //       result.summary.counters.updates().relationshipsDeleted;

    //     return counter > 0;
    //   });

    //   if (wasDeleted) {
    //     const decrementLikesQuery = `
    //         MATCH (p:Post {postId: $postId})
    //         SET p.likes = p.likes - 1
    //         RETURN p
    //   `;

    //     const decrementLikesParams = {
    //       postId,
    //     };

    //     await session.run(decrementLikesQuery, decrementLikesParams);
    //     return { result: "Deleted", likeId: "123" };
    //   }

    //   await session.executeWrite(async (transaction) => {
    //     const createLikeQuery = `
    //         MATCH (a:User {email: $authorEmail})
    //         MATCH (b:Post {postId: $postId})
    //         CREATE (c:Like {
    //           likeId: randomUUID()
    //         })-[:USER]->(a), (c)-[:POST]->(b)
    //         RETURN c
    //       `;

    //     const createLikeParams = {
    //       authorEmail,
    //       postId,
    //     };

    //     const likeResult = await transaction.run(
    //       createLikeQuery,
    //       createLikeParams
    //     );
    //     const likeNode = likeResult.records[0].get("c");

    //     const addLikeToPostQuery = `
    //         MATCH (p:Post {postId: $postId})
    //         MATCH (c:Like {likeId: $likeId})
    //         CREATE (c)-[:LIKE]->(p)
    //         RETURN c
    //       `;

    //     const addLikeToPostParams = {
    //       postId,
    //       likeId: likeNode.properties.likeId,
    //     };

    //     const likeWithRelationResult = await transaction.run(
    //       addLikeToPostQuery,
    //       addLikeToPostParams
    //     );

    //     const likeWithRelationNode = likeWithRelationResult.records[0].get("c");

    //     likeWithRelationNode.properties.author = likeNode.properties.author;

    //     const incrementLikesQuery = `
    //       MATCH (p:Post {postId: $postId})
    //       SET p.likes = p.likes + 1
    //       RETURN p
    //   `;

    //     const incrementLikesParams = {
    //       postId,
    //     };

    //     await transaction.run(incrementLikesQuery, incrementLikesParams);
    //   });

    //   return { result: "Created", likeId: "123" };
    // } finally {
    //   session.close();
    // }
  };
}
