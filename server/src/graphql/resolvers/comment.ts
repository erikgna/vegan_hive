import { driver, ogm } from "../..";
import { AuthUtils } from "../../firebase/auth";

export class CommentResolver {
  deleteComment = async (_: any, args: any, context: any) => {
    const { commentId } = args.input;

    const userInfo = await AuthUtils.verifyToken(context.firebaseId);

    try {
      await ogm.init();
      const Comment = ogm.model("Comment");

      const comment = await Comment.find({
        where: { commentId, author: { email: userInfo.email } },
      });

      if (comment.length === 0)
        throw new Error("You are not the author of this comment.");

      await Comment.delete({
        where: { commentId },
      });

      return "Success";
    } catch (error) {
      throw new Error("Could not delete comment. Please try again later.");
    }
  };

  createComment = async (_: any, args: any, context: any) => {
    const { content, postId } = args.input;

    const userInfo = await AuthUtils.verifyToken(context.firebaseId);
    try {
      await ogm.init();
      const Comment = ogm.model("Comment");

      const { comments } = await Comment.create({
        input: [
          {
            content,
            date: new Date().toISOString(),
            author: { connect: { where: { node: { email: userInfo.email } } } },
          },
        ],
        selectionSet: `
          {
            comments {
              commentId
              content
              date
              author {
                userId
                iconPath
                username
              }
            }                        
          }
        `,
      });

      const commentId = comments[0].commentId;

      const session = driver.session();
      await session.executeWrite(async (transaction) => {
        await transaction.run(
          `
            MATCH (p:Post {postId: $postId})
            MATCH (c:Comment {commentId: $commentId})
            CREATE (c)-[:COMMENT]->(p)
            RETURN c
          `,
          { postId, commentId }
        );
      });

      return comments[0];
    } catch (error) {
      throw new Error("Could not create comment. Please try again later.");
    }
  };
}
