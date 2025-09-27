import { useState, useEffect, useCallback } from "react";

export enum AppThemes {
  DARK = "dark",
  LIGHT = "light",
}
export const useTheme = () => {
  const setThemeAsDark = (theme: AppThemes) => {
    if (theme === AppThemes.DARK) return true;
    return false;
  };
  const [darkTheme, SetDarkTheme] = useState(() => {
    let theme = localStorage.getItem("theme");
    if (theme === AppThemes.DARK) return true;
    return false;
  });

  useEffect(() => {
    let theme: AppThemes | null = localStorage.getItem("theme") as AppThemes;
    if (!theme) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.setItem("theme", AppThemes.DARK);

        theme = AppThemes.DARK;
      } else {
        localStorage.setItem("theme", AppThemes.LIGHT);
        theme = AppThemes.LIGHT;
      }
    }
    SetDarkTheme(setThemeAsDark(theme));
    theme === AppThemes.DARK
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, []);

  const getTheme = useCallback(() => {
    if (darkTheme) return AppThemes.DARK;
    return AppThemes.LIGHT;
  }, [darkTheme]);

  const setTheme = (theme: AppThemes) => {
    if (theme === AppThemes.DARK) {
      localStorage.setItem("theme", AppThemes.DARK);
      document.dispatchEvent(
        new CustomEvent("ThemeChangeEvent", { detail: AppThemes.DARK })
      );
    } else {
      localStorage.setItem("theme", AppThemes.LIGHT);
      document.dispatchEvent(
        new CustomEvent("ThemeChangeEvent", { detail: AppThemes.LIGHT })
      );
    }

    SetDarkTheme(setThemeAsDark(theme));
  };

  return { setTheme, getTheme };
};
