
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../lib/models';
import { getCurrentUser, setCurrentUser, getUsers, createLog } from '../lib/storageService';
import { toast } from '@/hooks/use-toast';

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'client') => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  login: () => false,
  logout: () => {},
  register: () => false,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // In a real app, we'd hash and verify passwords, but for demo purposes:
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      // For demo purpose, we're not checking passwords
      setUser(user);
      setCurrentUser(user);
      
      // Log the login activity
      createLog({
        userId: user.id,
        actionType: 'login',
        description: `User ${user.name} logged in`,
        ip: '127.0.0.1',
        browser: navigator.userAgent,
      });
      
      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión como ${user.name}`,
      });
      
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Error de inicio de sesión",
      description: "Email o contraseña incorrectos",
    });
    
    return false;
  };

  const register = (name: string, email: string, password: string, role: 'client'): boolean => {
    // In a real app, we'd hash passwords and perform validations
    const users = getUsers();
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userExists) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: "Ya existe un usuario con ese email",
      });
      return false;
    }
    
    // For demo, create a simple user object
    const user = {
      name,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    };
    
    const createdUser = createUser(user);
    setUser(createdUser);
    setCurrentUser(createdUser);
    
    toast({
      title: "¡Registro exitoso!",
      description: "Tu cuenta ha sido creada correctamente",
    });
    
    return true;
  };

  const logout = () => {
    if (currentUser) {
      createLog({
        userId: currentUser.id,
        actionType: 'logout',
        description: `User ${currentUser.name} logged out`,
        ip: '127.0.0.1', 
        browser: navigator.userAgent,
      });
    }
    
    setUser(null);
    setCurrentUser(null);
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        loading, 
        login, 
        logout, 
        register, 
        isAuthenticated: !!currentUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to create a new user (imported from storageService)
import { createUser } from '../lib/storageService';
