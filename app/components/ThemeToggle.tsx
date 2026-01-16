"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [darkMode, setDarkMode]= useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains("dark");

        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setDarkMode(false);   
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setDarkMode(true);
        }

    }

    

return (
    <button
    onClick={toggleTheme}
    className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:ring-2 ring-blue-400 transition-all">
        {darkMode ? "☀️" : "🌙"}

    </button>

);
}