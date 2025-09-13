import { useState, useEffect } from "react";
export const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    let theme = localStorage.getItem("theme");
    if (!theme) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.setItem("theme", "dark");

        theme = "dark";
      } else {
        localStorage.setItem("theme", "light");
        theme = "light";
      }
    }
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);
  return (
    <div
      className={`
      relative w-12 h-6 flex items-center rounded-full cursor-pointer 
      ${darkMode ? "bg-gray-700" : "bg-white"} transition-colors duration-500
      shadow-md
    `}
      onClick={() => {
        //if theme is light its being set to dark
        if (!darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        setDarkMode(!darkMode);
      }}
    >
      <div
        className={`
        w-4 h-4 flex items-center justify-center rounded-full 
        transform transition-transform duration-500 ease-in-out
        ${darkMode ? "translate-x-7" : "translate-x-1"}
        ${darkMode ? "bg-gray-500 text-white" : "bg-yellow-400 text-gray-800"}
      `}
      >
        {darkMode ? (
          <svg
            className="w-4 h-4 text-gray-200 hidden dark:block"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-gray-800 dark:hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05L5.757 4.343a1 1 0 00-1.414 1.414l.707.707zm1.414 8.485l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z"></path>
          </svg>
        )}
      </div>
    </div>
  );
};
