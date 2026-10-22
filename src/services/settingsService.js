// src/services/settingsService.js
import api from "./api";

const API_URL = "/settings/profile";

// Get user profile settings
export const getProfileSettings = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update profile settings
export const updateProfileSettings = async (profileData) => {
  try {
    const response = await api.put(API_URL, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const settingsService = {
  getProfileSettings,
  updateProfileSettings,
};

export default settingsService;
