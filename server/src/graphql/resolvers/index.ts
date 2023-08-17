import { GraphQLUpload } from "graphql-upload-minimal";

import { CommentResolver } from "./comment";
import { PostResolver } from "./post";
import { UserResolver } from "./user";
import { LikeResolver } from "./like";

const userResolver = new UserResolver();
const postResolver = new PostResolver();
const commentResolver = new CommentResolver();
const likeResolver = new LikeResolver();

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getProfileInformation: userResolver.getProfileInformation,
    getUserPosts: postResolver.getUserPosts,
    getRecentPosts: postResolver.getRecentPosts,
    checkIfUserLikedPost: likeResolver.checkIfUserLikedPost,
  },
  Mutation: {
    createUser: userResolver.createUser,
    editUser: userResolver.editUser,
    createPost: postResolver.createPost,
    createComment: commentResolver.createComment,
    likePost: likeResolver.likePost,
  },
};
