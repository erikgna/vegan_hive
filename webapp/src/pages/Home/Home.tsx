import { useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

import Post from "../../components/Post";
import { IPost } from "../../interfaces/Post";
import Loading from "../../components/Loading";
import { QUERY_POSTS } from "../../apollo";

const Home = () => {
  const [currentPosts, setCurrentPosts] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const posts = useQuery(QUERY_POSTS, {
    variables: {
      page: page,
    }
  });

  const next = async () => {
    const refetched = await posts.refetch();

    const newPosts = [...currentPosts, ...refetched.data.getRecentPosts];
    setCurrentPosts(newPosts)
    setPage(page + 1);
    setHasMore(refetched.data.getRecentPosts.length > 0);
  }

  useEffect(() => {
    if (posts.data && currentPosts.length === 0) {
      setCurrentPosts(posts.data.getRecentPosts);
      setPage(page + 1);
    }
  }, [posts.data])

  if (currentPosts.length === 0) return <div className='h-screen w-screen flex flex-col items-center justify-center'>
    <Loading />
    <p className="mt-4 text-lg font-semibold">No posts yet</p>
  </div>

  return (
    <section className="w-full min-h-screen flex flex-col items-center pb-8 dark:bg-black xl:pl-[256px] pl-4 sm:pl-20 pr-4">
      <div className={`flex flex-col align-center max-post-width ${currentPosts.length === 0 && 'justify-center'}`}>

        <InfiniteScroll
          dataLength={currentPosts.length}
          next={next}
          hasMore={hasMore}
          loader={<div className="mt-8 flex justify-center items-center"></div>}
          endMessage={<h4 className="text-center text-gray-500 mt-12 mb-8">No more posts</h4>}
        >
          {currentPosts.map((post: IPost) => (
            <Post key={post.postId} post={post} />
          ))}
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default Home
