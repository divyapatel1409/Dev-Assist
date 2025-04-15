import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEnvironments } from '../services/envService';

const EnvironmentContext = createContext();

export const EnvironmentProvider = ({ children }) => {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnvironments = async () => {
    setIsLoading(true);
    try {
      const response = await getEnvironments();
      if (response.success) {
        setEnvironments(response.data);
        // If no environment is selected, select the first one
        if (!selectedEnvironment && response.data.length > 0) {
          setSelectedEnvironment(response.data[0]._id);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEnvironments();
  }, []);

  // Set up polling to keep environments in sync
  useEffect(() => {
    const interval = setInterval(fetchEnvironments, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const value = {
    environments,
    selectedEnvironment,
    setSelectedEnvironment,
    isLoading,
    error,
    refreshEnvironments: fetchEnvironments
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
}; 