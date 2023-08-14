import { useState } from "react";

import { IPost } from "../interfaces/Post";
import { PostModal } from "./PostModal";
import { Modal } from "./Modal";
import { formatDateString } from "../utils/dealDate";
import { BASE_URL } from "../constants/Url";

import likedIcon from "../assets/icons/heart-solid.svg";
import likeIconWhite from "../assets/icons/heart-regular-white.svg";
import likeIconDark from "../assets/icons/heart-regular-dark.svg";
import trashIconDark from "../assets/icons/trash-solid-dark.svg";
import trashIconWhite from "../assets/icons/trash-solid-white.svg";
import defaultAvatar from "../assets/images/default_avatar.png";
import { auth } from "../../firebase";
import { gql, useMutation, useQuery } from "@apollo/client";

interface PostProps {
  post: IPost;
  isFromUser?: boolean;
}

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      content
      date
      author {
        iconPath
        username
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($input: LikePostInput!) {
    likePost(input: $input) {
      likeId
    }
  }
`;

const POST_IS_LIKED = gql`
  query Query($postId: ID!, $authorEmail: String!) {
    checkIfUserLikedPost(postId: $postId, authorEmail: $authorEmail)
  }
`;

export const Post = ({ post, isFromUser = false }: PostProps) => {
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [createComment] = useMutation(CREATE_COMMENT);
  const [likePost] = useMutation(LIKE_POST);
  const postIsLiked = useQuery(POST_IS_LIKED, {
    variables: {
      postId: post.postId,
      authorEmail: auth.currentUser?.email,
    },
  });

  console.log(postIsLiked.data);

  const changePostModal = () => {
    setShowPostModal(!showPostModal);
  };

  const changeModal = () => {
    setShowModal(!showModal);
  };

  const handleLikePost = () => {
    likePost({
      variables: {
        input: {
          authorEmail: auth.currentUser?.email,
          postId: post.postId,
        },
      },
    }).then((data) => console.log(data));
  };

  const handlePostComment = () => {
    createComment({
      variables: {
        input: {
          content: text,
          authorEmail: auth.currentUser?.email,
          postId: post.postId,
        },
      },
    });
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md mt-8 dark:bg-black dark:border dark:border-gray-800">
      {showPostModal && <PostModal changeModal={changePostModal} post={post} />}
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
          src={post.author.iconPath ?? defaultAvatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="text-gray-700 text-lg font-semibold dark:text-white">
          {post.author.username} -{" "}
          <span className="font-normal text-sm">
            {formatDateString(post.date)}
          </span>
        </span>
      </div>
      <p className="text-gray-600 mb-4 dark:text-white">{post.content}</p>
      <img
        src={`${BASE_URL}${post.imagePath}`}
        alt={post.content}
        className="mb-4 rounded-md"
      />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button onClick={handleLikePost} className="mr-2">
            {postIsLiked.data.checkIfUserLikedPost ? (
              <img className="w-6 h-6" src={likedIcon} alt="like button" />
            ) : (
              <img
                className="w-6 h-6"
                src={
                  window.localStorage.getItem("theme")?.includes("dark")
                    ? likeIconWhite
                    : likeIconDark
                }
                alt="like button"
              />
            )}
          </button>
          <span className="text-gray-500 mr-2 dark:text-white">
            {post.likes} likes
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
            View all {post.comments.length} comments
          </button>
        </div>
      </div>
      <div className="flex mt-4">
        <input
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          placeholder="Add a comment..."
          className="flex-grow p-2 border-y border-l border-gray-300 rounded-l-md focus:outline-none focus:border-yellow-500 dark:bg-transparent"
        />
        <button
          onClick={handlePostComment}
          className="px-4 py-2 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600 focus:outline-none transition-all duration-300"
        >
          Post
        </button>
      </div>
    </div>
  );
};
