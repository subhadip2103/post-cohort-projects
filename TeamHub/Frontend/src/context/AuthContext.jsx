import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../api/base.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Check session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔐 Login
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    // After login, re-fetch user
    const meRes = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      credentials: "include",
    });

    const data = await meRes.json();
    setUser(data);
  };

  //signup
  const signup = async (firstname, lastname, email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ firstname, lastname, email, password }),
    });

    if (!res.ok) {
      throw new Error("Signup failed");
    }

  };

  
  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
