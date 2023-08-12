import { useState } from 'react'

import { IPost } from '../interfaces/Post'
import { PostModal } from './PostModal'
import { Modal } from './Modal'

// import likedIcon from '../assets/icons/heart-solid.svg'
import likeIconWhite from '../assets/icons/heart-regular-white.svg'
import likeIconDark from '../assets/icons/heart-regular-dark.svg'
import trashIconDark from '../assets/icons/trash-solid-dark.svg'
import trashIconWhite from '../assets/icons/trash-solid-white.svg'

interface PostProps {
    post: IPost;
    isFromUser?: boolean;
}

export const Post = ({ post, isFromUser = false }: PostProps) => {
    const [showPostModal, setShowPostModal] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)

    const changePostModal = () => {
        setShowPostModal(!showPostModal)
    }

    const changeModal = () => {
        setShowModal(!showModal)
    }

    return (
        <div className="bg-white p-4 shadow-md rounded-md mt-8 dark:bg-black dark:border dark:border-gray-800">
            {showPostModal && <PostModal changeModal={changePostModal} post={post} />}
            {showModal &&
                <Modal changeModal={changeModal}>
                    <div className="flex flex-col justify-center p-4 text-center">
                        <h2 className="text-xl font-semibold mb-2 dark:text-white">Confirm Deletetion</h2>
                        <p className="text-gray-600 dark:text-white">Are you sure you want to delete?</p>
                        <div className="w-full flex justify-center mt-6">
                            <button className="w-full font-semibold py-2 bg-yellow-500 text-white focus:outline-none border-yellow-300 hover:bg-yellow-700 mr-2 transition-all duration-300">Confirm</button>
                            <button onClick={changeModal} className="w-full font-semibold border py-2 text-yellow-500 hover:text-yellow-300 border-yellow-500 focus:outline-none border-yellow-300 transition-all duration-300">Cancel</button>
                        </div>
                    </div>
                </Modal>
            }
            <div className="flex items-center mb-4">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/245px-President_Barack_Obama.jpg"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-gray-700 text-lg font-semibold dark:text-white">{post.author.username} - <span className='font-normal text-sm'>{post.date}</span></span>
            </div>
            <p className="text-gray-600 mb-4 dark:text-white">{post.content}</p>
            <img src="https://media.cnn.com/api/v1/images/stellar/prod/170407220916-04-iconic-mountains-matterhorn-restricted.jpg?q=w_2512,h_1413,x_0,y_0,c_fill/h_618" alt="Post Image" className="mb-4 rounded-md" />
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <button className="mr-2">
                        <img className='w-6 h-6' src={window.localStorage.getItem('theme')?.includes('dark') ? likeIconWhite : likeIconDark} alt="like button" />
                    </button>
                    <span className="text-gray-500 mr-2 dark:text-white">{post.likes} likes</span>
                </div>
                {isFromUser && (
                    <button onClick={changeModal}>
                        <img src={window.localStorage.getItem('theme')?.includes('dark') ? trashIconWhite : trashIconDark} alt="Delete here" className='w-5 h-5' />
                    </button>
                )}
            </div>
            <div className="flex justify-between">
                <div className="flex items-center">
                    <button className='text-gray-500 dark:text-white' onClick={changePostModal}>
                        View all {post.comments.length} comments
                    </button>
                </div>
            </div>
            <div className="flex mt-4">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-grow p-2 border-y border-l border-gray-300 rounded-l-md focus:outline-none focus:border-yellow-500 dark:bg-transparent"
                />
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600 focus:outline-none transition-all duration-300">
                    Post
                </button>
            </div>
        </div>
    );
}
