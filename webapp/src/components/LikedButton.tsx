import likedIcon from "../assets/icons/heart-solid.svg";
import likeIconWhite from "../assets/icons/heart-regular-white.svg";
import likeIconDark from "../assets/icons/heart-regular-dark.svg";
import React from "react";

interface LikeButtonProps {
    isLiked: boolean;
    handleLikePost: () => void;
}

const LikeButton = ({ isLiked, handleLikePost }: LikeButtonProps) => {
    return <button onClick={handleLikePost} className="mr-2">
        {isLiked ?
            <img className="w-6 h-6" src={likedIcon} alt="like button" />
            :
            <img
                className="w-6 h-6"
                src={
                    window.localStorage.getItem("theme")?.includes("dark")
                        ? likeIconWhite
                        : likeIconDark
                }
                alt="like button"
            />}
    </button >
}

export default React.memo(LikeButton)