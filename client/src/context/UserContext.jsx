import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as planLimits from '../utils/planLimits';
import { userAPI, imageAPI } from '../utils/apiClient';

// Create context
const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser, updateUser: updateAuthUser } = useAuth();

  // Load user profile data when authenticated
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      
      if (authUser) {
        console.log('AuthUser dans UserContext:', authUser);
        // User is authenticated, get profile from API
        try {
          const profile = await userAPI.getProfile();
          
          // Merge the stored generation history from localStorage if it exists
          const storedUser = localStorage.getItem('pixelUser');
          let generationHistory = [];
          let savedImages = [];
          
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            generationHistory = parsedUser.generationHistory || [];
            savedImages = parsedUser.savedImages || [];
          } else {
            // Récupérer les images de l'utilisateur depuis l'API
            try {
              const userImages = await imageAPI.getUserImages();
              if (userImages && userImages.length > 0) {
                savedImages = userImages;
              }
            } catch (error) {
              console.error('Error loading user images:', error);
            }
          }
          
          // Set the complete user state
          setUser({
            ...profile,
            generationHistory,
            savedImages
          });
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUser(null);
        }
      } else {
        // L'utilisateur n'est pas authentifié
        setUser(null); // Ne pas utiliser le mock user par défaut
        localStorage.removeItem('pixelUser'); // Supprimer les données utilisateur en local
      }
      
      setLoading(false);
    };
    
    loadUserProfile();
  }, [authUser]);

  // Save local user data when it changes
  useEffect(() => {
    if (user && !authUser) {
      localStorage.setItem('pixelUser', JSON.stringify(user));
    }
  }, [user, authUser]);

  const updateUser = async (userData) => {
    // Update local state
    setUser(prev => ({
      ...prev,
      ...userData
    }));
    
    // If authenticated, update the profile in API
    if (authUser && userData) {
      try {
        const updateData = { ...userData };
        
        // Remove fields that shouldn't be in the profile
        delete updateData.generationHistory;
        delete updateData.savedImages;
        delete updateData.credits; // Ne pas mettre à jour les crédits ici
        
        const updatedProfile = await userAPI.updateProfile(updateData);
        
        // Mettre à jour l'état avec les données retournées par l'API
        setUser(prev => ({
          ...prev,
          ...updatedProfile
        }));
        
        // Mettre à jour également l'utilisateur d'auth si nécessaire
        if (updateData.email || updateData.profilePicture) {
          updateAuthUser({ 
            email: updateData.email,
            profilePicture: updateData.profilePicture 
          });
        }
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }
  };

  const deductCredits = async (amount) => {
    // If not authenticated, use local state only
    if (!authUser) {
      if (user.credits >= amount) {
        setUser(prev => ({
          ...prev,
          credits: prev.credits - amount
        }));
        return true;
      }
      return false;
    }
    
    // For authenticated users, use API
    try {
      const response = await userAPI.updateCredits(amount, 'deduct');
      
      // Update local state after successful deduction
      setUser(prev => ({
        ...prev,
        credits: response.credits
      }));
      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      return false;
    }
  };

  const addCredits = async (amount) => {
    // If not authenticated, use local state only
    if (!authUser) {
      setUser(prev => ({
        ...prev,
        credits: prev.credits + amount
      }));
      return true;
    }
    
    // For authenticated users, use API
    try {
      const response = await userAPI.updateCredits(amount, 'add');
      
      // Update local state after successful addition
      setUser(prev => ({
        ...prev,
        credits: response.credits
      }));
      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      return false;
    }
  };

  const addGenerationToHistory = (generation) => {
    setUser(prev => ({
      ...prev,
      generationHistory: [generation, ...prev.generationHistory].slice(0, 50) // Keep last 50
    }));
  };

  // Fonction pour sauvegarder une image
  const saveImage = async (image) => {
    // Check if the user has reached gallery limit
    if (!planLimits.canStoreMoreImages(user.subscriptionPlan, user.savedImages.length)) {
      console.error('Gallery storage limit reached for your plan');
      return false;
    }

    try {
      // Si l'utilisateur est authentifié, sauvegarder l'image via l'API
      if (authUser) {
        // Pour une image base64
        if (image.url && image.url.startsWith('data:')) {
          const response = await imageAPI.uploadBase64Image({
            base64Data: image.url,
            prompt: image.prompt,
            isPublic: image.isPublic || false,
            tags: image.tags || []
          });
          
          // Ajouter l'image à la liste des images sauvegardées
          setUser(prev => ({
            ...prev,
            savedImages: [response.image, ...prev.savedImages]
          }));
        } else {
          // Pour une URL existante
          const response = await imageAPI.saveImage({
            url: image.url,
            prompt: image.prompt,
            isPublic: image.isPublic || false,
            tags: image.tags || []
          });
          
          // Ajouter l'image à la liste des images sauvegardées
          setUser(prev => ({
            ...prev,
            savedImages: [response, ...prev.savedImages]
          }));
        }
      } else {
        // Pour utilisateur non authentifié, stockage local
        let imageToSave = { ...image, id: Date.now().toString() };
        setUser(prev => ({
          ...prev,
          savedImages: [imageToSave, ...prev.savedImages]
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error saving image:', error);
      return false;
    }
  };

  const deleteImage = async (imageId) => {
    try {
      // Si l'utilisateur est authentifié, supprimer l'image via l'API
      if (authUser) {
        await imageAPI.deleteImage(imageId);
      }
      
      // Supprimer l'image de l'état local
      setUser(prev => ({
        ...prev,
        savedImages: prev.savedImages.filter(img => img.id !== imageId)
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('pixelUser');
    setUser(null);
  };

  // Donne 20 crédits à tout nouvel utilisateur enregistré
  const grantInitialCredits = async () => {
    const initialCredits = 20;
    
    if (authUser) {
      // For authenticated users, add credits via API
      await addCredits(initialCredits);
    } else {
      // Update local state
      setUser(prev => ({
        ...prev,
        credits: initialCredits
      }));
    }
  };

  const value = {
    user,
    loading,
    updateUser,
    deductCredits,
    addCredits,
    addGenerationToHistory,
    saveImage,
    deleteImage,
    logout,
    grantInitialCredits,
    // Plan limitation helpers
    getMaxResolution: () => planLimits.getMaxResolution(user?.subscriptionPlan || 'free'),
    isResolutionAllowed: (width, height) => planLimits.isResolutionAllowed(user?.subscriptionPlan || 'free', width, height),
    getAvailableStyles: () => planLimits.getAvailableStyles(user?.subscriptionPlan || 'free'),
    isStyleAvailable: (style) => planLimits.isStyleAvailable(user?.subscriptionPlan || 'free', style),
    getMaxGalleryImages: () => planLimits.getMaxGalleryImages(user?.subscriptionPlan || 'free'),
    canStoreMoreImages: () => planLimits.canStoreMoreImages(user?.subscriptionPlan || 'free', user?.savedImages?.length || 0),
    getExportFormats: () => planLimits.getExportFormats(user?.subscriptionPlan || 'free'),
    isExportFormatAvailable: (format) => planLimits.isExportFormatAvailable(user?.subscriptionPlan || 'free', format),
    isBatchProcessingAvailable: () => planLimits.isBatchProcessingAvailable(user?.subscriptionPlan || 'free'),
    getMaxImagesPerGeneration: () => planLimits.getMaxImagesPerGeneration(user?.subscriptionPlan || 'free'),
    getPlanRequirementText: planLimits.getPlanRequirementText
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};