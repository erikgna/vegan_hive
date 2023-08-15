import likedIcon from "../assets/icons/heart-solid.svg";
import likeIconWhite from "../assets/icons/heart-regular-white.svg";
import likeIconDark from "../assets/icons/heart-regular-dark.svg";

interface LikeButtonProps {
    isLiked: boolean;
}

export const LikeButton = ({ isLiked }: LikeButtonProps) => {
    if (isLiked) {
        return <img className="w-6 h-6" src={likedIcon} alt="like button" />
    } else {
        return <img
            className="w-6 h-6"
            src={
                window.localStorage.getItem("theme")?.includes("dark")
                    ? likeIconWhite
                    : likeIconDark
            }
            alt="like button"
        />
    }
}