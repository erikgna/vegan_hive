import { gql } from "apollo-server";

export const userTypes = gql`
  type User {
    userId: ID! @id
    username: String!
    email: String! @unique
    iconPath: String
    description: String
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
`;
