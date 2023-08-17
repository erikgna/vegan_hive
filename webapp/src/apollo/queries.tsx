import { gql } from "@apollo/client";

export const POST_IS_LIKED = gql`
  query Query($postId: ID!) {
    checkIfUserLikedPost(postId: $postId)
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
        userId
        username        
        iconPath
      }
    }
  }
`;

export const QUERY_USER_POSTS = gql`
query Query($userId: ID!) {
  getUserPosts(userId: $userId){
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
        iconPath
      }
    }
}
`;

export const QUERY_PROFILE = gql`
  query GetProfileInformation($userId: ID!) {
    getProfileInformation(userId: $userId) {
      username
      description
      iconPath
    }
  }
`;

export const QUERY_PROFILE_PICTURE = gql`
  query GetProfile($email: String!) {
    getProfile(email: $email) {
      userId
      iconPath
    }
  }
`;

