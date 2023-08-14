import { gql, useQuery } from "@apollo/client"

import { Post } from "../../components/Post"
import { IPost } from "../../interfaces/Post"
import { Loading } from "../../components/Loading"

// const posts: IPost[] = [
//     {
//         postId: '1',
//         date: '12/08',
//         content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//         likes: 10,
//         comments: [
//             {
//                 commentId: '1',
//                 date: '12/08',
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//                 author: {
//                     userId: '1',
//                     username: 'Barack Obama',
//                 }
//             },
//             {
//                 commentId: '1',
//                 date: '12/08',
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//                 author: {
//                     userId: '1',
//                     username: 'Barack Obama',
//                 }
//             },
//             {
//                 commentId: '1',
//                 date: '12/08',
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//                 author: {
//                     userId: '1',
//                     username: 'Barack Obama',
//                 }
//             },
//             {
//                 commentId: '1',
//                 date: '12/08',
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//                 author: {
//                     userId: '1',
//                     username: 'Barack Obama',
//                 }
//             },
//             {
//                 commentId: '1',
//                 date: '12/08',
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//                 author: {
//                     userId: '1',
//                     username: 'Barack Obama',
//                 }
//             },
//             {
//                 commentId: '1',
//                 date: '12/08',
//                 content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//                 author: {
//                     userId: '1',
//                     username: 'Barack Obama',
//                 }
//             },
//         ],
//         author: {
//             userId: '1',
//             username: 'Barack Obama',
//         }
//     },
//     {
//         postId: '1',
//         date: '12/08',
//         content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//         likes: 10,
//         comments: [],
//         author: {
//             userId: '1',
//             username: 'Barack Obama',
//         }
//     },
// ]

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
`
export const Home = () => {
    const posts = useQuery(QUERY_POSTS);

    if (posts.loading) return <Loading />
    console.log(posts.data.posts)
    return (
        <section className='w-full flex justify-center pb-8 dark:bg-black'>
            <div className="flex flex-col align-center max-post-width">
                {posts.data.posts.map((post: IPost) => (
                    <Post key={post.postId} post={post} />
                ))}
            </div>
        </section>
    )
}
