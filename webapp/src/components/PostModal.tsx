import React, { useState } from 'react'

import { IPost } from '../interfaces/Post';

import defaultAvatar from '../assets/images/default_avatar.png'
import { BASE_URL } from '../constants/Url';
import { formatDateString } from '../utils/DealDate';
import LikeButton from './LikedButton';
import { CREATE_COMMENT, DELETE_COMMENT, LIKE_POST } from '../apollo';
import { useMutation } from '@apollo/client';
import PostComment from './PostComment';

import trash from "../assets/icons/trash-solid-dark.svg";
import Loading from './Loading';

interface PostModalPrps {
    changeModal: () => void;
    post: IPost;
    postIsLiked: boolean;
    handleDeletePost?: (postId: string) => void;
}

const PostModal = ({ post, postIsLiked, changeModal, handleDeletePost }: PostModalPrps) => {
    const [statePost, setStatePost] = useState(post)
    const [stateLiked, setStateLiked] = useState<boolean>(postIsLiked);
    const [loading, setLoading] = useState<boolean>(false);

    const [createComment] = useMutation(CREATE_COMMENT);
    const [deleteComment] = useMutation(DELETE_COMMENT);
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

    const handleDeleteComment = (commentId: string) => {
        deleteComment({
            variables: { input: { commentId } },
        }).then((_) => {
            setStatePost((prevState) => ({
                ...prevState,
                comments: prevState.comments.filter((comment) => comment.commentId !== commentId),
            }));
        });
    };

    return (
        <div onClick={handleOutsideClick} className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col md:flex-row bg-white md:pr-3 w-4/5 h-[95%] md:h-4/5 overflow-hidden relative dark:bg-[#181818]">
                <div className="items-center justify-center w-full w-3/4 h-full h-[60%] mr-4 bg-black bg-opacity-200 md:flex hidden">
                    <div className="flex items-center justify-center w-full overflow-hidden">
                        <img
                            src={`${BASE_URL}${statePost.imagePath}`}
                            alt={statePost.content}
                            className="object-cover max-w-full max-h-full"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-between md:px-0 px-4 h-full min-w-[300px]">
                    <div className="flex flex-col overflow-y-auto hide-scrollbar pt-4">
                        {statePost.comments.length === 0 && <p className="pt-4 text-gray-500 text-center">No comments yet</p>}
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
                                        <div className='flex items-center'>
                                            <span className="text-gray-600 text-md font-semibold dark:text-white">{statePost.author.username}</span>
                                            {comment.author.userId === localStorage.getItem("userId") &&
                                                <img onClick={() => handleDeleteComment(comment.commentId)} className='ml-2 h-3 w-3 md:h-4 md:w-4 cursor-pointer' src={trash} alt="Delete" />
                                            }
                                        </div>
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
                        {handleDeletePost !== undefined &&
                            loading ? <div className='flex items-center justify-center w-full mt-4'><Loading /></div> : <button onClick={() => {
                                setLoading(true)
                                if (handleDeletePost) handleDeletePost(statePost.postId)
                            }} className="mt-4 rounded-sm w-full font-semibold py-2 bg-red-500 text-white focus:outline-none border-red-300 hover:bg-red-700 mr-2 transition-all duration-300">
                            Delete Post
                        </button>
                        }
                        <div className='pb-4' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(PostModal);