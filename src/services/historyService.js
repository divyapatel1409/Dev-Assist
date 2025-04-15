import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}; 