"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");
        if (token && user) {
          setAuth({
            token,
            user: JSON.parse(user),
          });
        }
      } catch (error) {
        console.error("Failed to load auth data from AsyncStorage:", error);
      }
    };

    loadAuthData();
  }, [auth.token]);

  const logout = () => {
    // Clear authentication state
    setAuth({
      token: null,
      user: null,
    });
    // Remove token and user from AsyncStorage
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("allAddresses");
    AsyncStorage.removeItem("cartItems");
    AsyncStorage.removeItem("deliverAddress");
    AsyncStorage.removeItem("orderData");
    AsyncStorage.removeItem("selectedAddress");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
