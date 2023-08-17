import { ogm } from "../..";
import { AuthUtils } from "../../firebase/auth";
export class LikeResolver {
  checkIfUserLikedPost = async (_: any, args: any, context: any) => {
    const userInfo = await AuthUtils.verifyToken(context.firebaseId);
    try {
      await ogm.init();
      const Like = ogm.model("Like");

      const likes = await Like.find({
        where: {
          post: {
            postId: args.postId,
          },
          user: {
            email: userInfo.email,
          },
        },
      });

      return likes.length > 0;
    } catch (error) {
      throw new Error(
        "An error ocurred while retrieving like information about the post."
      );
    }
  };

  likePost = async (_: any, args: any, context: any) => {
    const postId = args.input.postId;

    const userInfo = await AuthUtils.verifyToken(context.firebaseId);
    try {
      await ogm.init();
      const Like = ogm.model("Like");
      const Post = ogm.model("Post");

      const like = await Like.find({
        where: {
          post: { postId },
          user: { email: userInfo.email },
        },
      });

      const posta = await Post.find({ where: { postId } });
      await Post.update({
        where: { postId },
        update: {
          likes: like.length > 0 ? posta[0].likes - 1 : posta[0].likes + 1,
        },
      });

      if (like.length > 0) {
        await Like.delete({
          where: {
            post: { postId },
            user: { email: userInfo.email },
          },
        });
        return { result: "Deleted", likeId: like[0].likeId };
      }

      const { likes } = await Like.create({
        input: [
          {
            post: { connect: { where: { node: { postId } } } },
            user: { connect: { where: { node: { email: userInfo.email } } } },
          },
        ],
      });

      return { result: "Created", likeId: likes[0].likeId };
    } catch (error) {
      throw new Error("Couldn't like post.");
    }
  };
}
