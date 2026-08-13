import {
  useMemo,
  useState,
} from "react";

import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";

import type {
  ReactNode
} from "react";

import {
  ThemeContext
} from "./theme";

interface Props {
  children: ReactNode;
}

export default function ThemeContextProvider({
  children
}: Props) {

  const [mode,setMode] =
  useState<"light"|"dark">((
    localStorage.getItem(
      "themeMode"
    ) as "light"|"dark"
  ) || "light");

  const toggleTheme=()=>{

    const newMode =
    mode==="light"
    ? "dark"
    : "light";

    setMode(newMode);

    localStorage.setItem(
      "themeMode",
      newMode
    );

  };

  const theme=
useMemo(
()=>createTheme({

palette:{

mode,

background:{
default:
mode==="dark"
? "#121212"
: "#f8fafc",

paper:
mode==="dark"
? "#1e1e1e"
: "#ffffff"
},

text:{
primary:
mode==="dark"
? "#ffffff"
: "#1a1a1a",

secondary:
mode==="dark"
? "#b0b0b0"
: "#666666"
}

}

}),
[mode]
);

  return (

    <ThemeContext.Provider
      value={{
        toggleTheme,
        mode
      }}
    >

      <ThemeProvider
        theme={theme}
      >
        {children}
      </ThemeProvider>

    </ThemeContext.Provider>

  );
}