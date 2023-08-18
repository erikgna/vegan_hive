import { gql } from "apollo-server";

export const postTypes = gql`
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
  input CreatePostInput {
    content: String!
    file: Upload!
  }
  input DeletePostInput {
    postId: ID!
  }
`;
