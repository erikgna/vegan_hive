import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Upload

  type User {
    userId: ID! @id
    username: String!
    email: String!
    iconPath: String
  }

  type Post {
    postId: ID! @id
    content: String!
    imagePath: String!
    author: User! @relationship(type: "AUTHOR", direction: IN)
    likes: Int!
    comments: [Comment!]! @relationship(type: "COMMENT", direction: IN)
    date: Date!
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

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  input CreateCommentInput {
    content: String!
    authorEmail: String!
    postId: ID!
  }

  input CreateUserInput {
    username: String!
    email: String!
    iconPath: String
  }

  input CreatePostInput {
    content: String!
    authorEmail: String!
    file: Upload!
  }

  input LikePostInput {
    postId: ID!
    authorEmail: String!
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment
    createUser(input: CreateUserInput!): User
    createPost(input: CreatePostInput!): Post
    likePost(input: LikePostInput!): Like
    singleUpload(file: Upload!): File!
  }
`;
