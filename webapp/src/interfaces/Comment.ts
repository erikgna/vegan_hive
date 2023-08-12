import { IUser } from "./User";

export interface IComment {
  commentId: string;
  content: string;
  date: string;
  author: IUser;
}
