import { useState, useEffect } from "react";

export function useDarkMode() {
    const [dark, setDark] = useState(
        localStorage.getItem("darkMode") === "1"
    );

    useEffect(() => {
        if (dark) {
            document.body.classList.add("dark");
            localStorage.setItem("darkMode", "1");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("darkMode", "0");
        }
    }, [dark]);

    return [dark, setDark];
}