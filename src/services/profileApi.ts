import axios from "axios";
import type { PasswordData, ProfileData } from "../types/profile";

const API =
"http://localhost:5000/api/users";

const token =
localStorage.getItem("token");

export const updateProfile =
(data:ProfileData)=>{

return axios.put(

`${API}/profile`,

data,

{

headers:{

Authorization:
`Bearer ${token}`

}

}

);

};

export const changePassword =
(data:PasswordData)=>{

return axios.put(

`${API}/change-password`,

data,

{

headers:{

Authorization:
`Bearer ${token}`

}

}

);

};