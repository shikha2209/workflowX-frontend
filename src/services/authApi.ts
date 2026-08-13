import axios from "axios";

const API = axios.create({

  baseURL:
  "http://localhost:5000/api/auth"

});


export interface SignupData {

  name:string;

  email:string;

  password:string;

  role:
  "admin"|
  "user";

}

export interface LoginData {

  email:string;

  password:string;

}


export const signupUser = (

data:SignupData

)=>

API.post(

"/signup",

data

);


export const loginUser = (

data:LoginData

)=>

API.post(

"/login",

data

);