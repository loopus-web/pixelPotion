import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import RetroButton from '../ui/RetroButton';
import { useSoundContext } from '../../context/SoundContext';

const ItemCard = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.primary}00,
      ${({ theme }) => theme.colors.primary}80,
      ${({ theme }) => theme.colors.primary}00
    );
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #111;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  image-rendering: pixelated;
  
  ${ItemCard}:hover & {
    transform: scale(1.05);
  }
`;

const ItemCategory = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  z-index: 2;
`;

const ItemContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ItemTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fonts.sizes.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ItemMeta = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fonts.sizes.xsmall};
`;

const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.colors.success};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fonts.sizes.medium};
`;

const ItemSeller = styled.div`
  font-style: italic;
`;

const ItemFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border}80;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceTag = styled.span`
  background: ${({ theme }) => theme.colors.success}20;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
`;

const MarketplaceItem = ({ item, onPurchase, isOwner, canAfford }) => {
  const { playSound } = useSoundContext();
  
  const handleHover = () => {
    playSound('hover');
  };
  
  const handlePurchase = () => {
    onPurchase(item.id);
  };
  
  // Format the category for display
  const formatCategory = (category) => {
    return category.replace('_', ' ');
  };
  
  return (
    <ItemCard onMouseEnter={handleHover}>
      <ImageContainer>
        <ItemImage src={item.imageUrl} alt={item.title} />
        <ItemCategory>{formatCategory(item.category)}</ItemCategory>
      </ImageContainer>
      
      <ItemContent>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemDescription>{item.description}</ItemDescription>
        
        <ItemMeta>
          <ItemSeller>Par {item.sellerName}</ItemSeller>
          <span>
            {formatDistanceToNow(new Date(item.listedAt), { 
              addSuffix: true,
              locale: fr
            })}
          </span>
        </ItemMeta>
      </ItemContent>
      
      <ItemFooter>
        <PriceTag>
          <span role="img" aria-label="credit">💎</span> {item.price}
        </PriceTag>
        
        {isOwner ? (
          <RetroButton color="secondary" small disabled>
            Votre création
          </RetroButton>
        ) : (
          <RetroButton 
            color="primary" 
            small 
            onClick={handlePurchase}
            disabled={!canAfford}
          >
            {canAfford ? 'Acheter' : 'Crédits insuffisants'}
          </RetroButton>
        )}
      </ItemFooter>
    </ItemCard>
  );
};

export default MarketplaceItem;
