export interface Notification {
  _id:string;

  id: string;

  title: string;

  message: string;

  createdAt: string;

  type:
    | "task"
    | "approval"
    | "deadline"
    | "system";

  isRead?: boolean;


}