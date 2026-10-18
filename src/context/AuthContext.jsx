// Authentication context: holds the signed-in user and exposes login / signup / logout.
import React, { createContext, useContext, useState } from 'react';
import { authenticate, registerAccount, getSessionUser, saveSession, clearSession } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSessionUser());

  // Throws an Error (with a friendly message) when the credentials are wrong.
  const login = (email, password, role) => {
    const signedIn = authenticate(email, password, role);
    saveSession(signedIn);
    setUser(signedIn);
    return signedIn;
  };

  // Create an account; the caller then asks the user to sign in.
  const signup = (details) => registerAccount(details);

  const logout = () => { clearSession(); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
