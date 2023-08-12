import React from 'react'

import { IPost } from '../interfaces/Post';

// import likedIcon from '../assets/icons/heart-solid.svg'
import likeIconDark from '../assets/icons/heart-regular-dark.svg'
import likeIconWhite from '../assets/icons/heart-regular-white.svg'

interface PostModalPrps {
    changeModal: () => void;
    post: IPost;
}

export const PostModal = ({ post, changeModal }: PostModalPrps) => {
    const handleOutsideClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            changeModal()
        }
    }

    return (
        <div onClick={handleOutsideClick} className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="flex bg-white pr-6 w-4/5 h-4/5 overflow-hidden relative dark:bg-black">
                <img
                    src="https://media.cnn.com/api/v1/images/stellar/prod/170407220916-04-iconic-mountains-matterhorn-restricted.jpg?q=w_2512,h_1413,x_0,y_0,c_fill/h_618"
                    alt="Post Image"
                    className="w-3/4 h-full mr-4 object-cover"
                />
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col overflow-y-auto hide-scrollbar pt-4">
                        {post.comments.map((comment) => (
                            <div
                                key={comment.commentId}
                                className="flex flex-col mb-6 border-b border-gray-200 pb-2 dark:border-gray-600"
                            >
                                <div className="flex items-center mb-2">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/245px-President_Barack_Obama.jpg"
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <span className="text-gray-600 text-sm font-semibold dark:text-white">
                                        {post.author.username} - <span className='font-normal text-xs'>{comment.date}</span>
                                    </span>
                                </div>
                                <span className="text-gray-600 text-sm dark:text-gray-300">{comment.content}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2 mt-4">
                            <div className="flex items-center">
                                <button className="mr-2 text-gray-500 hover:text-yellow-500 focus:outline-none">
                                    <img className="w-6 h-6" src={window.localStorage.getItem('theme')?.includes('dark') ? likeIconWhite : likeIconDark} alt="like button" />
                                </button>
                                <span className="text-gray-500 mr-2 dark:text-white">{post.likes} likes</span>
                            </div>
                        </div>
                        <div className="flex mt-2 pb-4">
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
                </div>
            </div>
        </div>
    )
}
