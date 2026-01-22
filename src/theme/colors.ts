export const lightTheme = {
  colors: {
    primary: "#e50914",
    background: "#ffffff",
    card: "#f5f5f5",
    text: "#000000",
    textSecondary: "#666666",
    border: "#dddddd",
    error: "#ff3333",
    success: "#00c853",
    rating: "#ffd700",
  },
};

export const darkTheme = {
  colors: {
    primary: "#e50914",
    background: "#000000",
    card: "#1a1a1a",
    text: "#ffffff",
    textSecondary: "#999999",
    border: "#333333",
    error: "#ff3333",
    success: "#00c853",
    rating: "#ffd700",
  },
};

export type Theme = typeof lightTheme;
