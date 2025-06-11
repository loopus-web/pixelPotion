import React, { useState } from 'react';
import styled from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';
import RetroButton from '../ui/RetroButton';
import RetroInput from '../ui/RetroInput';
import RetroSelect from '../ui/RetroSelect';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 0 20px ${({ theme }) => theme.colors.primary}50;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.primary}00,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primary}00
    );
  }
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-transform: uppercase;
  text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}40;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ImageItem = styled.div`
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  ${({ selected, theme }) => selected && `
    &:after {
      content: '✓';
      position: absolute;
      top: 5px;
      right: 5px;
      background: ${theme.colors.primary};
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  `}
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: contain;
  background: #000;
  display: block;
  image-rendering: pixelated;
`;

const ModalFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const categories = [
  { value: 'illustration', label: 'Illustration' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'game_item', label: 'Game Item' },
  { value: 'texture', label: 'Texture' },
  { value: 'ui', label: 'UI' },
  { value: 'character', label: 'Character' },
  { value: 'animation', label: 'Animation' }
];

const ListItemModal = ({ isOpen, onClose, onSubmit, userGenerations }) => {
  const { playSound } = useSoundContext();
  
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'illustration',
    price: 10,
    royalty: 5  // Percentage of future sales
  });
  
  if (!isOpen) return null;
  
  const selectedImage = userGenerations.find(img => img.id === selectedImageId);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'royalty' ? parseInt(value, 10) : value
    }));
    playSound('click');
  };
  
  const handleSelectImage = (imageId) => {
    setSelectedImageId(imageId);
    
    // Find the selected image
    const image = userGenerations.find(img => img.id === imageId);
    
    // Pre-fill the title with the prompt if available
    if (image && image.prompt) {
      setFormData(prev => ({
        ...prev,
        title: image.prompt.split(' ').slice(0, 5).join(' ') + '...',
        description: image.prompt
      }));
    }
    
    playSound('select');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      playSound('error');
      return;
    }
    
    onSubmit({
      originalId: selectedImage.id,
      imageUrl: selectedImage.url,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      royalty: formData.royalty,
      prompt: selectedImage.prompt,
      width: selectedImage.width,
      height: selectedImage.height,
      seed: selectedImage.seed
    });
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>Liste ton art dans la marketplace</ModalTitle>
        <ModalClose onClick={onClose}>&times;</ModalClose>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Sélectionne une création à vendre</FormLabel>
            {userGenerations.length > 0 ? (
              <ImagesGrid>
                {userGenerations.map(image => (
                  <ImageItem 
                    key={image.id}
                    selected={image.id === selectedImageId}
                    onClick={() => handleSelectImage(image.id)}
                  >
                    <ItemImage src={image.url} alt={image.prompt} />
                  </ImageItem>
                ))}
              </ImagesGrid>
            ) : (
              <EmptyState>
                <p>Tu n'as pas encore de créations à vendre. Génère d'abord des images dans le générateur.</p>
              </EmptyState>
            )}
          </FormGroup>
          
          {selectedImage && (
            <>
              <FormGroup>
                <FormLabel htmlFor="title">Titre</FormLabel>
                <RetroInput
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Donne un nom accrocheur à ton art"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="description">Description</FormLabel>
                <RetroInput
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décris ton art pour les acheteurs potentiels"
                  required
                  as="textarea"
                  rows={3}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="category">Catégorie</FormLabel>
                <RetroSelect
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  options={categories}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="price">Prix (en crédits)</FormLabel>
                <RetroInput
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
                <InfoText>Fixe un prix équitable pour ton art pixel. Un prix entre 5 et 50 crédits est recommandé.</InfoText>
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="royalty">Royalties (%)</FormLabel>
                <RetroInput
                  id="royalty"
                  name="royalty"
                  type="number"
                  min="0"
                  max="20"
                  value={formData.royalty}
                  onChange={handleInputChange}
                  required
                />
                <InfoText>Pourcentage que tu recevras sur les ventes futures de ton art (max 20%).</InfoText>
              </FormGroup>
            </>
          )}
          
          <ModalFooter>
            <RetroButton type="button" color="secondary" onClick={onClose}>
              Annuler
            </RetroButton>
            <RetroButton 
              type="submit" 
              color="primary"
              disabled={!selectedImage}
            >
              Mettre en vente
            </RetroButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ListItemModal;
