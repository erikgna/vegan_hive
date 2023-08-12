import { gql, useApolloClient, useMutation } from "@apollo/client"

import { Post } from "../../components/Post"
import { IPost } from "../../interfaces/Post"
import { useState } from "react"

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

const SINGLE_UPLOAD_MUTATION = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file) {
      id
    }
  }
`;


export const Home = () => {
    const [uploadFileMutation] = useMutation(SINGLE_UPLOAD_MUTATION);
    const apolloClient = useApolloClient();

    const [file, setFile] = useState<File | undefined>()

    const teste = async () => {
        uploadFileMutation({ variables: { file } }).then(() => {
            apolloClient.resetStore();
        });
    }

    return (
        <section className='w-full flex justify-center pb-8 dark:bg-black'>
            <button onClick={teste}>
                teste
            </button>
            <input type="file" onChange={e => setFile(e.target.files?.[0])} />
            {/* <div className="flex flex-col align-center max-post-width">
                {posts.map(post => (
                    <Post key={post.postId} post={post} />
                ))}
            </div> */}
        </section>
    )
}
