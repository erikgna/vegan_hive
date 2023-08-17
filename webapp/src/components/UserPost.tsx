import { useState } from 'react'
import { IPost } from '../interfaces/Post';
import { BASE_URL } from '../constants/Url';
import { PostModal } from './PostModal';
import { useQuery } from '@apollo/client';
import { POST_IS_LIKED } from '../apollo';

interface UserPostProps {
    post: IPost;
}

export const UserPost = ({ post }: UserPostProps) => {
    const [showPostModal, setShowPostModal] = useState<boolean>(false);

    const postIsLiked = useQuery(POST_IS_LIKED, {
        variables: {
            postId: post.postId
        },
    });


    const changePostModal = () => {
        setShowPostModal(!showPostModal);
    };

    return (
        <div onClick={changePostModal} key={post.postId} className="cursor-pointer bg-[#131313] flex items-center justify-center">
            {showPostModal && !postIsLiked.loading && <PostModal postIsLiked={postIsLiked.data.checkIfUserLikedPost} changeModal={changePostModal} post={post} />}
            <img
                src={`${BASE_URL}${post.imagePath}`}
                alt={post.content}
                className="sm:w-full h-auto min-h-100 min-w-100 object-cover"
            />
        </div>
    )
}
