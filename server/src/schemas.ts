import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    userId: ID! @id
    username: String!
  }

  type Post {
    postId: ID! @id
    title: String!
    content: String!
    author: User! @relationship(type: "AUTHOR", direction: IN)
    likes: Int
    comments: [Comment!]! @relationship(type: "COMMENT", direction: IN)
  }

  type Comment {
    commentId: ID! @id
    content: String!
    author: User @relationship(type: "AUTHOR", direction: IN)
  }

  type Like {
    likeId: ID! @id
    post: Post! @relationship(type: "POST", direction: IN)
    user: User! @relationship(type: "USER", direction: IN)
  }

  input CreateCommentInput {
    content: String!
    authorId: ID!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  input LikePostInput {
    postId: ID!
    userId: ID!
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment
    createPost(input: CreatePostInput!): Post
    likePost(input: LikePostInput!): Like
  }
`;
