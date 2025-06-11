import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    try {
      setIsLoading(true);
      // Vérifier si un token existe dans localStorage
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Utiliser le token pour récupérer les informations de l'utilisateur
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const response = await authAPI.register(email, password);
      const { user: userData, token } = response;
      
      // Sauvegarder le token d'authentification
      localStorage.setItem('authToken', token);
      
      // Mettre à jour l'état
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Compte créé avec succès!');
      return userData;
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Erreur lors de la création du compte');
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, token } = response;
      
      // Sauvegarder le token d'authentification
      localStorage.setItem('authToken', token);
      
      // Mettre à jour l'état
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Connexion réussie!');
      return userData;
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Échec de la connexion');
      throw error;
    }
  };

  const signInWithProvider = async (provider) => {
    try {
      // Pour les providers OAuth, on peut rediriger vers le backend ou recevoir un token selon l'implémentation
      const response = await authAPI.loginWithProvider({ provider });
      const { user: userData, token } = response;
      
      // Sauvegarder le token d'authentification
      localStorage.setItem('authToken', token);
      
      // Mettre à jour l'état
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success(`Connexion avec ${provider} réussie!`);
      return userData;
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      toast.error(error.message || `Échec de la connexion avec ${provider}`);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Supprimer le token d'authentification
      localStorage.removeItem('authToken');
      
      // Réinitialiser l'état
      setUser(null);
      setIsAuthenticated(false);
      
      toast.info('Vous avez été déconnecté');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Mise à jour des informations utilisateur
  const updateUser = (userData) => {
    setUser(prev => ({
      ...prev,
      ...userData
    }));
  };

  useEffect(() => {
    checkUser();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login: signInWithEmail,
    logout,
    checkUser,
    signInWithProvider,
    signInWithEmail,
    signUpWithEmail,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;