import { IPost } from "./Post";
import { IUser } from "./User";

export interface ILike {
  likeId: string;
  post: IPost;
  user: IUser;
}
