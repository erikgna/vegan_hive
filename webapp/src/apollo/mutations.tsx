import { gql } from "@apollo/client";

export const CREATE_POST = gql`  
    mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input){
            postId
        }
    }
`

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      commentId
      content
      date
      author {
        userId
        iconPath
        username
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) 
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) 
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

export const SAVE_USER_TOKEN = gql`
  mutation SaveToken($input: SaveUserTokenInput!) {
    saveUserToken(input: $input) {
      userId
    }
  }
`;
