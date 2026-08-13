import {
  useState,
  
} from "react";

import {
  AuthContext
} from "./AuthContext";

import type {
  Role,
  AuthUser,
} from "./authTypes";

export function AuthProvider({

  children,

}:{
  children:React.ReactNode;
}) {
const [token,setToken] =
useState<string | null>(

localStorage.getItem("token")

);

  const [role,
  setRole] =
  useState<Role>(

    () =>

      (
        localStorage.getItem(
          "role"
        ) as Role
      ) || null

  );

const [currentUser,
setCurrentUser] =
useState<AuthUser | null>(
() => {

const storedUser =
localStorage.getItem(
"user"
);

return storedUser

? JSON.parse(storedUser)

: null;

}
);
  const login = (

    token:string,

    r: Role,

    user?: AuthUser

  ) => {
setToken(token);
    setRole(r);

    localStorage.setItem(
      "role",
      r ?? ""
    );

    localStorage.setItem(
      "token",
      token
    );

    if(user){

      setCurrentUser(user);

      localStorage.setItem(

        "user",

        JSON.stringify(user)

      );

    }

  };

  const logout = () => {

    setRole(null);
setToken(null);
    setCurrentUser(null);

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

  };

  return (

    <AuthContext.Provider
      value={{

        role,

        token,

        currentUser,

        setCurrentUser,

        login,

        logout,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}