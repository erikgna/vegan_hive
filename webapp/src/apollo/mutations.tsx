import { gql } from "@apollo/client";

export const CREATE_POST = gql`  
    mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
            content,            
            author {
                userId
            }
        }
    }
`

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      content
      date
      author {
        iconPath
        username
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($input: LikePostInput!) {
    likePost(input: $input) {
      likeId
    }
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($input: EditUserInput!) {
    editUser(input: $input) {
      username
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      userId
    }
  }
`;
