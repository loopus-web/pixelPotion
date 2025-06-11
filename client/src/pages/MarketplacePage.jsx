import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUserContext } from '../context/UserContext';
import { useMarketplaceContext } from '../context/MarketplaceContext';
import { useSoundContext } from '../context/SoundContext';
import RetroButton from '../components/ui/RetroButton';
import RetroInput from '../components/ui/RetroInput';
import RetroSelect from '../components/ui/RetroSelect';
import { toast } from 'react-toastify';
import MarketplaceItem from '../components/marketplace/MarketplaceItem';
import ListItemModal from '../components/marketplace/ListItemModal';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fonts.sizes.xxxlarge};
  text-transform: uppercase;
  text-shadow: 0 0 15px ${({ theme }) => theme.colors.primary + '60'};
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
  }
`;

const MarketplaceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const FilterItem = styled.div`
  min-width: 150px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1;
    min-width: 120px;
  }
`;

const InfoPanel = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MarketplaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MarketplacePage = () => {
  const { user } = useUserContext();
  const { marketplace, listItem, purchaseItem } = useMarketplaceContext();
  const { playSound } = useSoundContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'newest',
    searchTerm: ''
  });
  
  const [filteredItems, setFilteredItems] = useState([]);
  
  useEffect(() => {
    // Apply filters to marketplace items
    let items = [...marketplace.items];
    
    // Apply category filter
    if (filters.category !== 'all') {
      items = items.filter(item => item.category === filters.category);
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch(filters.sortBy) {
      case 'newest':
        items.sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));
        break;
      case 'oldest':
        items.sort((a, b) => new Date(a.listedAt) - new Date(b.listedAt));
        break;
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    setFilteredItems(items);
  }, [marketplace.items, filters]);
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    playSound('click');
  };
  
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
    playSound('menu');
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    playSound('close');
  };
  
  const handleListItem = (itemData) => {
    listItem({
      ...itemData,
      sellerId: user.id,
      sellerName: user.username,
      listedAt: new Date().toISOString()
    });
    toast.success('Your item has been listed in the marketplace!');
    playSound('success');
    setIsModalOpen(false);
  };
  
  const handlePurchase = (itemId) => {
    const success = purchaseItem(itemId, user.id);
    if (success) {
      toast.success('Item purchased successfully!');
      playSound('buy');
    } else {
      toast.error('Not enough credits to purchase this item.');
      playSound('error');
    }
  };
  
  return (
    <PageContainer>
      <PageTitle>Pixel Art Marketplace</PageTitle>
      
      <InfoPanel>
        <InfoRow>
          <span>Available Credits: <strong>{user.credits}</strong></span>
          <span>Your Listed Items: <strong>{marketplace.items.filter(item => item.sellerId === user.id).length}</strong></span>
          <span>Total Marketplace Items: <strong>{marketplace.items.length}</strong></span>
        </InfoRow>
      </InfoPanel>
      
      <MarketplaceHeader>
        <RetroButton color="primary" onClick={handleOpenModal}>
          List Your Art
        </RetroButton>
        
        <FiltersContainer>
          <FilterItem>
            <RetroInput 
              placeholder="SEARCH..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </FilterItem>
          
          <FilterItem>
            <RetroSelect
              name="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'illustration', label: 'Illustration' },
                { value: 'portrait', label: 'Portrait' },
                { value: 'game_item', label: 'Game Item' },
                { value: 'texture', label: 'Texture' },
                { value: 'ui', label: 'UI' },
                { value: 'character', label: 'Character' },
                { value: 'animation', label: 'Animation' }
              ]}
            />
          </FilterItem>
          
          <FilterItem>
            <RetroSelect
              name="sortBy"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' }
              ]}
            />
          </FilterItem>
        </FiltersContainer>
      </MarketplaceHeader>
      
      {filteredItems.length > 0 ? (
        <MarketplaceGrid>
          {filteredItems.map(item => (
            <MarketplaceItem
              key={item.id}
              item={item}
              onPurchase={handlePurchase}
              isOwner={item.sellerId === user.id}
              canAfford={user.credits >= item.price}
            />
          ))}
        </MarketplaceGrid>
      ) : (
        <EmptyState>
          <h3>No items found</h3>
          <p>Be the first to list your pixel art in the marketplace or try different filters.</p>
        </EmptyState>
      )}
      
      <ListItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleListItem}
        userGenerations={user.generationHistory.filter(item => !marketplace.items.some(marketItem => marketItem.originalId === item.id))}
      />
    </PageContainer>
  );
};

export default MarketplacePage;
