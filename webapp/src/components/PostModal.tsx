import React, { useState } from 'react'

import { IPost } from '../interfaces/Post';

import defaultAvatar from '../assets/images/default_avatar.png'
import { BASE_URL } from '../constants/Url';
import { formatDateString } from '../utils/DealDate';
import { LikeButton } from './LikedButton';
import { CREATE_COMMENT, LIKE_POST } from '../apollo';
import { useMutation } from '@apollo/client';
import { PostComment } from './PostComment';

interface PostModalPrps {
    changeModal: () => void;
    post: IPost;
    postIsLiked: boolean;
}

export const PostModal = ({ post, postIsLiked, changeModal }: PostModalPrps) => {
    const [statePost, setStatePost] = useState(post)
    const [stateLiked, setStateLiked] = useState<boolean>(postIsLiked);

    const [createComment] = useMutation(CREATE_COMMENT);
    const [likePost] = useMutation(LIKE_POST);

    const handleOutsideClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            changeModal()
        }
    }

    const handleLikePost = () => {
        likePost({
            variables: {
                input: {
                    postId: statePost.postId,
                },
            },
        }).then((_) => {
            const updatedLikes = stateLiked ? statePost.likes - 1 : statePost.likes + 1;
            setStatePost((prevState) => ({ ...prevState, likes: updatedLikes }));
            setStateLiked(!stateLiked);
        });
    };

    const handlePostComment = (text: string) => {
        createComment({
            variables: {
                input: {
                    content: text,
                    postId: statePost.postId,
                },
            },
        }).then((data) => {
            setStatePost((prevState) => ({ ...prevState, comments: [{ ...data.data.createComment }, ...prevState.comments,] }))
        });
    };

    return (
        <div onClick={handleOutsideClick} className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col md:flex-row bg-white md:pr-3 w-4/5 h-[95%] md:h-4/5 overflow-hidden relative dark:bg-[#181818]">
                <div className="flex items-center justify-center w-full w-3/4 md:h-full h-[60%] md:mr-4 bg-black bg-opacity-200">
                    <div className="w-full h-60 overflow-hidden">
                        <img
                            src={`${BASE_URL}${statePost.imagePath}`}
                            alt={statePost.content}
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-between md:px-0 px-2 overflow-y-auto hide-scrollbar md:h-full h-[40%] min-w-[300px]">
                    <div className="flex flex-col sm:overflow-y-auto hide-scrollbar pt-4">
                        {statePost.comments.map((comment) => (
                            <div
                                key={comment.commentId}
                                className="flex flex-col mb-6 border-b border-gray-200 pb-2 dark:border-gray-600"
                            >
                                <div className="flex items-center mb-2">
                                    <img
                                        src={comment.author.iconPath === null ? defaultAvatar : `${BASE_URL}${comment.author.iconPath}`}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <div className='flex flex-col'>
                                        <span className="text-gray-600 text-md font-semibold dark:text-white">{statePost.author.username}</span>
                                        <span className='text-gray-500 font-normal text-xs'>{formatDateString(comment.date)}</span>
                                    </div>
                                </div>
                                <span className="text-gray-600 text-sm dark:text-gray-300">{comment.content}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2 mt-4">
                            <div className="flex items-center">
                                <LikeButton isLiked={stateLiked} handleLikePost={handleLikePost} />
                                <span className="text-gray-500 mr-2 dark:text-white">{statePost.likes} likes</span>
                            </div>
                        </div>
                        <PostComment handlePostComment={handlePostComment} />
                        <div className='pb-4' />
                    </div>
                </div>
            </div>
        </div>
    )
}
