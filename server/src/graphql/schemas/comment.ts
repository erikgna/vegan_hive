import { gql } from "apollo-server";

export const commentTypes = gql`
  type Comment {
    commentId: ID! @id
    content: String!
    author: User @relationship(type: "AUTHOR", direction: OUT)
    date: String!
  }

  input CreateCommentInput {
    content: String!
    postId: ID!
  }
`;
