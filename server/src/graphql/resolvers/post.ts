import { driver, ogm } from "../..";
import { AuthUtils } from "../../firebase/auth";
import { saveFile } from "../../utils/saveFile";
import fs from "fs";

const selectionSet = `
      {
        postId
        content
        imagePath
        likes
        date
        comments {
          commentId
          content
          date
          author {
            userId
            username
            iconPath
            email
          }
        }
        author {
          userId
          username
          email
          iconPath
        }
      }
    `;

export class PostResolver {
  deletePost = async (_: any, args: any, context: any) => {
    const { postId } = args.input;

    const userInfo = await AuthUtils.verifyToken(context.firebaseId);

    try {
      await ogm.init();
      const Post = ogm.model("Post");

      const post = await Post.find({
        where: { postId, author: { email: userInfo.email } },
      });

      if (post.length === 0)
        throw new Error("You are not the author of this post.");

      fs.unlinkSync(post[0].imagePath);

      await Post.delete({
        where: { postId },
      });

      return "Success";
    } catch (error) {
      throw new Error("Could not delete post. Please try again later.");
    }
  };
  getUserPosts = async (_: any, args: any, context: any) => {
    await AuthUtils.verifyToken(context.firebaseId);
    try {
      await ogm.init();
      const Post = ogm.model("Post");

      const posts = await Post.find({
        where: {
          author: {
            userId: args.userId,
          },
        },
        selectionSet,
      });

      return posts;
    } catch (error) {
      throw new Error("An error ocurred while retrieving user posts.");
    }
  };
  getRecentPosts = async (_: any, args: any, context: any) => {
    await AuthUtils.verifyToken(context.firebaseId);
    try {
      const size = 10;

      await ogm.init();
      const Post = ogm.model("Post");

      const posts = await Post.find({
        options: {
          sort: [{ date: "DESC" }],
          limit: size,
          offset: args.page * size,
        },
        selectionSet,
      });

      return posts;
    } catch (error) {
      throw new Error("An error ocurred while retrieving recent posts.");
    }
  };
  createPost = async (_: any, args: any, context: any) => {
    const { content, file } = args.input;

    const userInfo = await AuthUtils.verifyToken(context.firebaseId);
    try {
      await ogm.init();
      const Post = ogm.model("Post");

      const post = await Post.create({
        input: [
          {
            content,
            date: new Date().toISOString(),
            imagePath: "",
            likes: 0,
            author: { connect: { where: { node: { email: userInfo.email } } } },
          },
        ],
      });

      const postId = post.posts[0].postId;
      const path = `${userInfo.user_id}/posts/${postId}`;

      const imagePath = await saveFile(file, path);

      await Post.update({
        where: { postId },
        update: { imagePath },
      });

      return post.posts[0];
    } catch (error) {
      throw new Error("Could not create post. Please try again later.");
    }
  };
}
