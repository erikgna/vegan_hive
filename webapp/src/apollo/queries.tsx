import { gql } from "@apollo/client";

export const POST_IS_LIKED = gql`
  query Query($postId: ID!, $authorEmail: String!) {
    checkIfUserLikedPost(postId: $postId, authorEmail: $authorEmail)
  }
`;

export const QUERY_POSTS = gql`
  query Query($page: Int!) {
    getRecentPosts(page: $page) {      
      postId
      content
      imagePath
      likes
      date
      comments {        
        content
        date
        author {          
          username
          iconPath
          email
        }
      }
      author {        
        username
        email
        iconPath
      }
    }
  }
`;

export const QUERY_USER_POSTS = gql`
  query Query($authorEmail: String!) {
    getUserPosts(authorEmail: $authorEmail) {
      postId
      content
      imagePath
      likes
      date
      comments {
        commentId
        content
        date
        author {
          userId
          username
          iconPath
          email
        }
      }
      author {
        userId
        username
        email
        iconPath
      }
    }
  }
`;

export const QUERY_PROFILE = gql`
  query GetProfileInformation($email: String!) {
    getProfileInformation(email: $email) {
      username
      description
      iconPath
    }
  }
`;

