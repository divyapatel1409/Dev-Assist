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

export const getEnvironments = async () => {
  try {
    const response = await axios.get(`${API_URL}/env`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching environments:', error);
    throw error;
  }
};

export const getEnvironmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/env/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching environment:', error);
    throw error;
  }
};

export const createEnvironment = async (envData) => {
  try {
    const response = await axios.post(`${API_URL}/env`, envData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating environment:', error);
    throw error;
  }
};

export const updateEnvironment = async (id, envData) => {
  try {
    const response = await axios.put(`${API_URL}/env/${id}`, envData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating environment:', error);
    throw error;
  }
};

export const deleteEnvironment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/env/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting environment:', error);
    throw error;
  }
};