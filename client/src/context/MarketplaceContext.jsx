import { createContext, useContext, useState, useEffect } from 'react';
import { useUserContext } from './UserContext';

// Create context
const MarketplaceContext = createContext();

// Initial marketplace state
const INITIAL_MARKETPLACE = {
  items: [],
  transactions: []
};

export function MarketplaceProvider({ children }) {
  const { user, updateUser, deductCredits } = useUserContext();
  const [marketplace, setMarketplace] = useState(INITIAL_MARKETPLACE);
  
  // Load marketplace data from localStorage
  useEffect(() => {
    const storedMarketplace = localStorage.getItem('pixelMarketplace');
    
    if (storedMarketplace) {
      setMarketplace(JSON.parse(storedMarketplace));
    } else {
      localStorage.setItem('pixelMarketplace', JSON.stringify(INITIAL_MARKETPLACE));
    }
  }, []);
  
  // Save marketplace data when it changes
  useEffect(() => {
    localStorage.setItem('pixelMarketplace', JSON.stringify(marketplace));
  }, [marketplace]);
  
  // List a new item in the marketplace
  const listItem = (itemData) => {
    const newItem = {
      id: `item_${Date.now()}`,
      ...itemData,
      listedAt: new Date().toISOString(),
      status: 'active'
    };
    
    setMarketplace(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    
    return newItem;
  };
  
  // Remove an item from the marketplace
  const removeItem = (itemId) => {
    setMarketplace(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };
  
  // Purchase an item from the marketplace
  const purchaseItem = async (itemId, buyerId) => {
    const itemToPurchase = marketplace.items.find(item => item.id === itemId);
    
    if (!itemToPurchase) {
      console.error('Item not found');
      return false;
    }
    
    // Check if user has enough credits
    if (user.credits < itemToPurchase.price) {
      console.error('Not enough credits');
      return false;
    }
    
    // Deduct credits from buyer - use async version
    const deductionSuccess = await deductCredits(itemToPurchase.price);
    
    if (!deductionSuccess) {
      return false;
    }
    
    // Create transaction record
    const transaction = {
      id: `tx_${Date.now()}`,
      itemId: itemToPurchase.id,
      buyerId,
      sellerId: itemToPurchase.sellerId,
      price: itemToPurchase.price,
      timestamp: new Date().toISOString()
    };
    
    // Add item to buyer's purchased items
    const purchasedItem = {
      ...itemToPurchase,
      purchasedAt: new Date().toISOString()
    };
    
    // Update buyer's purchased items array
    if (user.id === buyerId) {
      updateUser({
        purchasedItems: [...(user.purchasedItems || []), purchasedItem]
      });
    }
    
    // Update marketplace state
    setMarketplace(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
      transactions: [...prev.transactions, transaction]
    }));
    
    return true;
  };
  
  // Get all items listed by a specific user
  const getUserListings = (userId) => {
    return marketplace.items.filter(item => item.sellerId === userId);
  };
  
  // Get all purchases made by a specific user
  const getUserPurchases = (userId) => {
    return marketplace.transactions.filter(tx => tx.buyerId === userId);
  };
  
  // Get all sales made by a specific user
  const getUserSales = (userId) => {
    return marketplace.transactions.filter(tx => tx.sellerId === userId);
  };
  
  const value = {
    marketplace,
    listItem,
    removeItem,
    purchaseItem,
    getUserListings,
    getUserPurchases,
    getUserSales
  };
  
  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export const useMarketplaceContext = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
  }
  return context;
};
