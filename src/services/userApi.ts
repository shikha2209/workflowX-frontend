import axios from "axios";

const API = axios.create({

  baseURL:
  "http://localhost:5000/api/users"

});

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

export const getUsers =
(
  page: number,
  limit:number
)=>
API.get("/",{
  params:{
    page,
    limit,
  }
});

export const deleteUser =
(id:string)=>

API.delete(
`/${id}`
);

export const approveUser =
(id:string)=>
API.put(
`/${id}/approve`
);

export const blockUser =
(id:string)=>
API.put(
`/${id}/block`
);