// AppContext.js
import React, { createContext, useState } from "react";

// Create Context
export const AuthContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
