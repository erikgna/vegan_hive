import { IComment } from "./Comment";
import { IUser } from "./User";

export interface IPost {
  postId: string;
  content: string;
  date: string;
  likes: number;
  imagePath: string;
  comments: IComment[];
  author: IUser;
}
