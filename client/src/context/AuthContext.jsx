import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axios";

// =>  Create the AuthContext
export const AuthContext = createContext();

// => Create Coustom Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ? Check if the existed Token is Expired or not
  // Simple helper function to check if a JWT is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      // Split the token to get the payload (2nd part)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const { exp } = JSON.parse(jsonPayload);
      // exp is in seconds, Date.now() is in milliseconds
      return Date.now() >= exp * 1000;
    } catch (error) {
      return true; // If token is malformed, treat it as expired
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    if (token && isTokenExpired(token)) {
      logout();
    } else if (userInfo && token) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      if (error.response?.data?.needsVerification) throw error.response.data;
      throw error.response?.data?.message || "Login failed";
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return data; // Returns { message, email }
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "OTP verification failed";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, verifyOTP, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create Custom Hook To Use AuthContext
export const useAuthContext = () => {
  const values = useContext(AuthContext);
  return values;
};
