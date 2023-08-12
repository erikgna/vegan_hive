import { gql } from "@apollo/client";

const GET_POSTS = gql`
  {
    Post {
      postId
      title
      description
      numberOfLikes
      comments {
        comment
        author {
          name
        }
      }
    }
  }
`;
