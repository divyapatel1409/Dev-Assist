import axios from 'axios';


const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? token : null;
};

// Set auth headers
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCollections = async () => {
  try {
    const response = await axios.get(`${API_URL}/collection`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

export const getCollectionWithRequests = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/collection/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching collection details:', error);
    throw error;
  }
};

export const createCollection = async (collectionData) => {
  try {
    const response = await axios.post(`${API_URL}/collection`, collectionData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

export const deleteCollection = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/collection/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
};