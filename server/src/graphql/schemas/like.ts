import { gql } from "apollo-server";

export const likeTypes = gql`
  type Like {
    likeId: ID! @id
    post: Post! @relationship(type: "POST", direction: OUT)
    user: User! @relationship(type: "USER", direction: OUT)
  }

  type LikeResult {
    result: String!
    likeId: ID!
  }

  input LikePostInput {
    postId: ID!
    authorEmail: String!
  }
`;
