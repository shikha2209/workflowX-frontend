import {
  createContext
} from "react";

interface SearchContextType {

  searchTerm: string;

  setSearchTerm:
  React.Dispatch<
    React.SetStateAction<string>
  >;

}

export const SearchContext =
createContext<
SearchContextType | undefined
>(undefined);