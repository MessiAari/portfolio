// The two theme palettes, mirrored from app/globals.css so the mode-switch
// animation can paint the *next* theme before the page itself switches.
export const themeColors = {
  light: { background: "#f2efe9", foreground: "#131313", accent: "#2f54eb" },
  dark: { background: "#0d0d0f", foreground: "#ece9e2", accent: "#7d95ff" },
} as const;
