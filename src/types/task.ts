
export interface Task {

  _id:string;

  id?:string;

  title:string;

  description:string;

  priority:
  "High"
  |
  "Medium"
  |
  "Low";

  dueDate:string;

  assignee:string;

  status:string;

  createdAt: string;
  
  updatedAt?: string;

}

