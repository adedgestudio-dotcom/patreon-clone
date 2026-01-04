"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { currentTheme, switchTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (themeName) => {
    switchTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] hover:bg-opacity-80 transition-all"
        aria-label="Switch theme"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="hidden sm:inline text-sm font-medium">
          {themes[currentTheme].name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-xl z-50">
          <div className="p-2">
            <p className="px-3 py-1 text-xs font-semibold text-[var(--color-text)] opacity-60">
              Choose Theme
            </p>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                  currentTheme === key
                    ? "bg-[var(--color-primary)] bg-opacity-20"
                    : "hover:bg-[var(--color-bg)]"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <span className="text-sm font-medium">{theme.name}</span>
                {currentTheme === key && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
