import { gql } from "apollo-server";

export const userTypes = gql`
  type User {
    userId: ID! @id
    username: String!
    email: String! @unique
    iconPath: String
    description: String
    token: String
  }

  input CreateUserInput {
    username: String!
    email: String!
  }

  input EditUserInput {
    username: String
    file: Upload
    description: String
  }

  input SaveUserTokenInput {
    email: String!
    token: String!
  }
`;
