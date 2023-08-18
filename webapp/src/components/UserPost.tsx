import { useState } from 'react'
import { IPost } from '../interfaces/Post';
import { BASE_URL } from '../constants/Url';
import PostModal from './PostModal';
import { useQuery } from '@apollo/client';
import { POST_IS_LIKED } from '../apollo';
import React from 'react';

interface UserPostProps {
    post: IPost;
    handleDeletePost: (postId: string) => void;
}

const UserPost = ({ post, handleDeletePost }: UserPostProps) => {
    const [showPostModal, setShowPostModal] = useState<boolean>(false);

    const postIsLiked = useQuery(POST_IS_LIKED, {
        variables: {
            postId: post.postId
        },
    });


    const changePostModal = () => {
        setShowPostModal(!showPostModal);
    };

    if (showPostModal) {
        return <PostModal handleDeletePost={handleDeletePost} postIsLiked={postIsLiked.data.checkIfUserLikedPost} changeModal={changePostModal} post={post} />
    }

    return (
        <div onClick={changePostModal} key={post.postId} className="cursor-pointer bg-[#131313] flex items-center justify-center">
            <img
                src={`${BASE_URL}${post.imagePath}`}
                alt={post.content}
                className="max-h-full max-w-full object-cover"
            />
        </div>
    )
}

export default React.memo(UserPost);