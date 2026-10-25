import api from "../api/axiosInstance";

const API_URL = "/gallery";

// 1. Fetch all gallery items
export const getAllGalleryItems = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. Add new gallery media
export const addGalleryItem = async (data) => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. Update gallery media
export const updateGalleryItem = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 4. Delete gallery media
export const deleteGalleryItem = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const galleryService = {
  getAllGalleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};

export default galleryService;
