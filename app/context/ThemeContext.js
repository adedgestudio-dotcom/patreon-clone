"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { themes, defaultTheme } from "../config/themes";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("app-theme");
    if (saved && themes[saved]) setCurrentTheme(saved);
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    localStorage.setItem("app-theme", currentTheme);
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    if (themes[themeName]) setCurrentTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, switchTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
