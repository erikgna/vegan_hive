import { Post } from "../../components/Post"
import { IPost } from "../../interfaces/Post"

const posts: IPost[] = [
    {
        postId: '1',
        date: '12/08',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
        likes: 10,
        comments: [
            {
                commentId: '1',
                date: '12/08',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
                author: {
                    userId: '1',
                    username: 'Barack Obama',
                }
            },
            {
                commentId: '1',
                date: '12/08',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
                author: {
                    userId: '1',
                    username: 'Barack Obama',
                }
            },
            {
                commentId: '1',
                date: '12/08',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
                author: {
                    userId: '1',
                    username: 'Barack Obama',
                }
            },
            {
                commentId: '1',
                date: '12/08',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
                author: {
                    userId: '1',
                    username: 'Barack Obama',
                }
            },
            {
                commentId: '1',
                date: '12/08',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
                author: {
                    userId: '1',
                    username: 'Barack Obama',
                }
            },
            {
                commentId: '1',
                date: '12/08',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
                author: {
                    userId: '1',
                    username: 'Barack Obama',
                }
            },
        ],
        author: {
            userId: '1',
            username: 'Barack Obama',
        }
    },
    {
        postId: '1',
        date: '12/08',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
        likes: 10,
        comments: [],
        author: {
            userId: '1',
            username: 'Barack Obama',
        }
    },
]

export const Home = () => {
    return (
        <section className='w-full flex justify-center pb-8 dark:bg-black'>
            <div className="flex flex-col align-center max-post-width">
                {posts.map(post => (
                    <Post key={post.postId} post={post} />
                ))}
            </div>
        </section>
    )
}
