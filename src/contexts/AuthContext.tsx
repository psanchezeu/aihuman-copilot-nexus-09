import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/models";
import { getCurrentUser, setCurrentUser } from "@/lib/storageService";

interface AuthContextProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  setCurrentUser: () => {},
  isAuthenticated: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setCurrentUserState(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    setIsAuthenticated(!!user);
    setCurrentUser(user); // Save to localStorage
  };

  const value: AuthContextProps = {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
