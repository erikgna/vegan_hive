import { driver } from "../..";

export class CommentResolver {
  createComment = async (_: any, args: any) => {
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

        const userResult = await transaction.run(readUserQuery, readUserParams);

        const userNode = userResult.records[0].get("u");
        commentNode.properties.author = userNode.properties;

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
  };
}
