import { useState } from "react";

interface PostCommentProps {
    handlePostComment: (text: string) => void;
}
export const PostComment = ({ handlePostComment }: PostCommentProps) => {
    const [text, setText] = useState<string>("");

    return <div className="flex mt-4">
        <input
            onChange={(e) => setText(e.target.value)}
            value={text}
            type="text"
            placeholder="Add a comment..."
            className="flex-grow p-2 border-y border-l border-gray-300 rounded-l-md focus:outline-none focus:border-yellow-500 dark:bg-transparent dark:text-white"
        />
        <button
            onClick={() => {
                handlePostComment(text)
                setText("")
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600 focus:outline-none transition-all duration-300"
        >
            Post
        </button>
    </div>
}
