import { gql } from "apollo-server";

import { userTypes } from "./user";
import { postTypes } from "./post";
import { commentTypes } from "./comment";
import { likeTypes } from "./like";

export const typeDefs = gql`
  scalar Upload

  ${userTypes}
  ${postTypes}
  ${commentTypes}
  ${likeTypes}

  type Query {
    checkIfUserLikedPost(postId: ID!): Boolean!
    getRecentPosts(page: Int!): [Post!]!
    getUserPosts(userId: ID!): [Post!]!
    getProfileInformation(userId: ID!): User!
    getProfile(email: String!): User!
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment
    createUser(input: CreateUserInput!): User
    createPost(input: CreatePostInput!): Post
    likePost(input: LikePostInput!): LikeResult
    editUser(input: EditUserInput!): User
    saveUserToken(input: SaveUserTokenInput!): User
  }
`;
