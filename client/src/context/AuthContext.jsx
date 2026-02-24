import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AuthContext = createContext();

// Custom hook (VERY IMPORTANT)
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto login if token exists
  useEffect(() => {
    const storedUser = localStorage.getItem("skillswapUser");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = (userData) => {
    localStorage.setItem("skillswapUser", JSON.stringify(userData));
    setUser(userData);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("skillswapUser");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
