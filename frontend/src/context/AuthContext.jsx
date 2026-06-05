import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);
    const [needsVerify, setNeedsVerify] = useState(
        localStorage.getItem("needs_verify") === "1"
    );

    useEffect(() => {
        if (!token) return;

        fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch(() => {
                localStorage.removeItem("token");
                setToken(null);
            });
    }, [token]);

    function login(token, user, needsVerify = false) {
        localStorage.setItem("token", token);
        localStorage.setItem("needs_verify", needsVerify ? "1" : "0");
        setToken(token);
        setUser(user);
        setNeedsVerify(needsVerify);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("needs_verify");
        setToken(null);
        setUser(null);
        setNeedsVerify(false);
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout, needsVerify, setNeedsVerify }}>
            {children}
        </AuthContext.Provider>
    );
}