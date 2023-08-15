import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { IPost } from "../interfaces/Post";
import { PostModal } from "./PostModal";
import { Modal } from "./Modal";
import { formatDateString } from "../utils/dealDate";
import { BASE_URL } from "../constants/Url";
import { auth } from "../../firebase";
import { Loading } from "./Loading";
import { LikeButton } from "./LikedButton";
import { PostComment } from "./PostComment";
import { CREATE_COMMENT, LIKE_POST, POST_IS_LIKED } from "../apollo";

import trashIconDark from "../assets/icons/trash-solid-dark.svg";
import trashIconWhite from "../assets/icons/trash-solid-white.svg";
import defaultAvatar from "../assets/images/default_avatar.png";

interface PostProps {
    post: IPost;
    isFromUser?: boolean;
}

export const Post = ({ post, isFromUser = false }: PostProps) => {
    const [statePost, setStatePost] = useState(post)
    const [showPostModal, setShowPostModal] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [stateLiked, setStateLiked] = useState<boolean | null>(null);

    const [createComment] = useMutation(CREATE_COMMENT);
    const [likePost] = useMutation(LIKE_POST);

    const postIsLiked = useQuery(POST_IS_LIKED, {
        variables: {
            postId: post.postId,
            authorEmail: auth.currentUser?.email,
        },
    });

    const changePostModal = () => {
        setShowPostModal(!showPostModal);
    };

    const changeModal = () => {
        setShowModal(!showModal);
    };

    const handlePostComment = (text: string) => {
        createComment({
            variables: {
                input: {
                    content: text,
                    authorEmail: auth.currentUser?.email,
                    postId: statePost.postId,
                },
            },
        }).then((data) => setStatePost((prevState) => ({ ...prevState, comments: [...prevState.comments, { ...data.data.createComment }] })));
    };

    if (postIsLiked.loading) {
        return <div>
            {/* <Loading /> */}
        </div>
    }

    const handleLikePost = () => {
        const userLikedPost = postIsLiked.data.checkIfUserLikedPost;
        const isLiked = stateLiked === null ? userLikedPost : stateLiked;

        likePost({
            variables: {
                input: {
                    authorEmail: auth.currentUser?.email,
                    postId: statePost.postId,
                },
            },
        }).then((_) => {
            const updatedLikes = isLiked ? statePost.likes - 1 : statePost.likes + 1;
            setStatePost((prevState) => ({ ...prevState, likes: updatedLikes }));
            setStateLiked(!isLiked);
        });
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-md mt-8 dark:bg-black dark:border dark:border-gray-800">
            {showPostModal && <PostModal postIsLiked={stateLiked ?? postIsLiked.data.checkIfUserLikedPost} changeModal={changePostModal} post={statePost} />}
            {showModal && (
                <Modal changeModal={changeModal}>
                    <div className="flex flex-col justify-center p-4 text-center">
                        <h2 className="text-xl font-semibold mb-2 dark:text-white">
                            Confirm Deletetion
                        </h2>
                        <p className="text-gray-600 dark:text-white">
                            Are you sure you want to delete?
                        </p>
                        <div className="w-full flex justify-center mt-6">
                            <button className="w-full font-semibold py-2 bg-yellow-500 text-white focus:outline-none border-yellow-300 hover:bg-yellow-700 mr-2 transition-all duration-300">
                                Confirm
                            </button>
                            <button
                                onClick={changeModal}
                                className="w-full font-semibold border py-2 text-yellow-500 hover:text-yellow-300 focus:outline-none border-yellow-300 transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            <div className="flex items-center mb-4">
                <img
                    src={statePost.author.iconPath ?? defaultAvatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-gray-700 text-lg font-semibold dark:text-white">
                    {statePost.author.username} -{" "}
                    <span className="font-normal text-sm">
                        {formatDateString(statePost.date)}
                    </span>
                </span>
            </div>
            <p className="text-gray-600 mb-4 dark:text-white">{statePost.content}</p>
            <img
                src={`${BASE_URL}${statePost.imagePath}`}
                alt={statePost.content}
                className="mb-4 rounded-md"
            />
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <LikeButton isLiked={stateLiked ?? postIsLiked.data.checkIfUserLikedPost} handleLikePost={handleLikePost} />
                    <span className="text-gray-500 mr-2 dark:text-white">
                        {statePost.likes} likes
                    </span>
                </div>
                {isFromUser && (
                    <button onClick={changeModal}>
                        <img
                            src={
                                window.localStorage.getItem("theme")?.includes("dark")
                                    ? trashIconWhite
                                    : trashIconDark
                            }
                            alt="Delete here"
                            className="w-5 h-5"
                        />
                    </button>
                )}
            </div>
            <div className="flex justify-between">
                <div className="flex items-center">
                    <button
                        className="text-gray-500 dark:text-white"
                        onClick={changePostModal}
                    >
                        View all {statePost.comments.length} comments
                    </button>
                </div>
            </div>
            <PostComment handlePostComment={handlePostComment} />
        </div>
    );
};
