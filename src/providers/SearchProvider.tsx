import {
  useState,
  type ReactNode,
} from "react";

import {
  SearchContext
} from "../context/SearchContext";

export function SearchProvider({

  children,

}:{
  children:ReactNode;
}) {

  const [searchTerm,
  setSearchTerm] =
  useState("");

  return (

    <SearchContext.Provider
      value={{

        searchTerm,

        setSearchTerm,

      }}
    >

      {children}

    </SearchContext.Provider>

  );

}