import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api"; // Aapka axios setup

// 1. Context banaya gaya hai
const SettingsContext = createContext();

// 2. Provider component banaya gaya hai jo pure app ko lapetega (wrap karega)
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Database se settings fetch karne ka function
  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const { data } = await API.get("/settings");
      setSettings(data);
    } catch (error) {
      console.error("Global Settings Load Error:", error);
    } finally {
      setLoadingSettings(false);
    }
  };

  // Jab app pehli baar khulega tab ye chalega
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, fetchSettings, loadingSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// 3. Custom Hook kisi bhi file me settings use karne ke liye
export const useSettings = () => useContext(SettingsContext);
