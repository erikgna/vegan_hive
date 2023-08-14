import { IComment } from "./Comment";
import { ILike } from "./Like";
import { IUser } from "./User";

export interface IPost {
  postId: string;
  content: string;
  date: string;
  likes: number;
  imagePath: string;
  comments: IComment[];
  allLikes: ILike[];
  author: IUser;
}
