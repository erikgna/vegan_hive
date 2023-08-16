import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Upload

  type User {
    userId: ID! @id
    username: String!
    email: String! @unique
    iconPath: String
    description: String
  }

  type Post {
    postId: ID! @id
    content: String!
    imagePath: String!
    author: User! @relationship(type: "AUTHOR", direction: OUT)
    likes: Int!
    comments: [Comment!]! @relationship(type: "COMMENT", direction: IN)
    allLikes: [Like!]! @relationship(type: "LIKE", direction: IN)
    date: String!
  }

  type Comment {
    commentId: ID! @id
    content: String!
    author: User @relationship(type: "AUTHOR", direction: OUT)
    date: String!
  }

  type Like {
    likeId: ID! @id
    post: Post! @relationship(type: "POST", direction: OUT)
    user: User! @relationship(type: "USER", direction: OUT)
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
  }

  input EditUserInput {
    email: String!
    username: String
    file: Upload
    description: String
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

  type LikeResult {
    result: String!
    likeId: ID!
  }

  type Query {
    checkIfUserLikedPost(postId: ID!, authorEmail: String!): Boolean!
    getRecentPosts(page: Int!): [Post!]!
    getUserPosts(authorEmail: String!): [Post!]!
    getProfileInformation(email: String!): User!
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment
    createUser(input: CreateUserInput!): User
    createPost(input: CreatePostInput!): Post
    likePost(input: LikePostInput!): LikeResult
    singleUpload(file: Upload!): File!
    editUser(input: EditUserInput!): User
  }
`;
