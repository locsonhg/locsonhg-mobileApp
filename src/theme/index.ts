import { lightTheme, darkTheme } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { borderRadius } from "./borderRadius";

export const theme = {
  light: {
    ...lightTheme,
    typography,
    spacing,
    borderRadius,
  },
  dark: {
    ...darkTheme,
    typography,
    spacing,
    borderRadius,
  },
};

export type AppTheme = typeof theme.light;

export { lightTheme, darkTheme } from "./colors";
export { typography } from "./typography";
export { spacing } from "./spacing";
export { borderRadius } from "./borderRadius";
