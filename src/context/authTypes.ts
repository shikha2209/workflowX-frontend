export type Role =

| "admin"
| "user"
| null;

export interface AuthUser {

  id?: string;

  name?: string;

  email?: string;

  role?: Role;

  profileImage?: string;

   phone?: string;

    bio?: string;

     department?: string;

}

export interface AuthContextType {

  role: Role;

  token: string | null;
  
  currentUser:
  AuthUser | null;

  setCurrentUser:
React.Dispatch<
React.SetStateAction<AuthUser | null>
>;

  login: (
    token: string  ,
    role: Role,
    user?: AuthUser
  ) => void;

  logout: () => void;

}