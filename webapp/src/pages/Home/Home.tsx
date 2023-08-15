import { gql, useQuery } from "@apollo/client";

import { Post } from "../../components/Post";
import { IPost } from "../../interfaces/Post";
import { Loading } from "../../components/Loading";

const QUERY_POSTS = gql`
  query Posts {
    posts {
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
export const Home = () => {
    const posts = useQuery(QUERY_POSTS);

    if (posts.loading) return <Loading />;

    return (
        <section className="w-full flex justify-center pb-8 dark:bg-black">
            <div className="flex flex-col align-center max-post-width">
                {posts.data.posts.map((post: IPost) => (
                    <Post key={post.postId} post={post} />
                ))}
            </div>
        </section>
    );
};
