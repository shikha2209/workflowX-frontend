import axios from "axios";
import type { Task as TaskData } from "../types/task";
const API =
axios.create({

baseURL:
"http://localhost:5000/api/tasks"

});


// attach JWT token

API.interceptors.request.use(

(config)=>{

const token =
localStorage.getItem(
"token"
);

if(token){

config.headers.Authorization =
`Bearer ${token}`;

}

return config;

}

);



//get tasks

export const getTasks =
()=> API.get("/");

// create task

export const createTask =

(data:TaskData)=>

API.post(
"/",
data
);

//delete task

export const deleteTaskApi =

(id:string)=>

API.delete(
`/${id}`
);

//update task status

export const updateTaskStatus =

(
id:string,
status:string
)=>

API.put(

`/${id}/status`,

{
status
}

);

//update task details

export interface UpdateTaskPayload {

title?:string;

description?:string;

priority?:
"High"
|
"Medium"
|
"Low";

dueDate?:string;

assignee?:string;

status?:string;

}

export const updateTaskApi = (

id:string,

data:UpdateTaskPayload

)=>

API.put(

`/${id}`,

data

);