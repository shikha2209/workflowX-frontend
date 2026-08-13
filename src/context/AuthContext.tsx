// import {
//   createContext,
//   useContext,
//   useState
// } from "react";

// import type {
//   ReactNode
// } from "react";

// interface User {
//   name: string;
//   role: "admin" | "user";
// }

// interface AuthContextType {
//   user: User | null;
//   login:(user:User)=>void;
//   logout:()=>void;
// }

// const AuthContext =
// createContext<AuthContextType>({
//   user:null,
//   login:()=>{},
//   logout:()=>{}
// });

// export const useAuth=
// ()=>useContext(
// AuthContext
// );

// export default function AuthProvider({
// children
// }:{
// children:ReactNode
// }){

// const [user,setUser]=
// useState<User|null>(

// JSON.parse(
// localStorage.getItem(
// "user"
// )||"null"
// )

// );

// const login=(
// userData:User
// )=>{

// setUser(
// userData
// );

// localStorage.setItem(
// "user",
// JSON.stringify(
// userData
// )
// );

// };

// const logout=()=>{

// setUser(null);

// localStorage.removeItem(
// "user"
// );

// };

// return(

// <AuthContext.Provider
// value={{
// user,
// login,
// logout
// }}
// >

// {children}

// </AuthContext.Provider>

// );

// }
import { createContext } from "react";
import type { AuthContextType } from "./authTypes";

export const AuthContext = createContext<AuthContextType>({
  role: null,
  token: null,
  currentUser: null,
  setCurrentUser: () => {},
  login: () => {},
  logout: () => {},
});