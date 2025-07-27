import React from 'react';
import { authClient } from '../../lib/auth-client';

// Create a React context for the auth client
export const AuthContext = React.createContext(authClient);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <AuthContext.Provider value={authClient}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth client
export const useAuthClient = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthClient must be used within an AuthProvider');
  }
  return context;
};
