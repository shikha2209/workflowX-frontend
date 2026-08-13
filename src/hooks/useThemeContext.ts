import { useContext } from "react";

import {
  ThemeContext
} from "../context/theme";

import type {
  ThemeContextType
} from "../context/theme";

export const useThemeContext =
():ThemeContextType=>
useContext(
  ThemeContext
);