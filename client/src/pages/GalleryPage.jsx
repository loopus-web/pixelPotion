import { useState } from 'react';
import styled from 'styled-components';
import { useUserContext } from '../context/UserContext';
import { useSoundContext } from '../context/SoundContext';
import RetroButton from '../components/ui/RetroButton';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.fonts.sizes.xxlarge};
`;

const EmptyGallery = styled.div`
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const GalleryItem = styled.div`
  background-color: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  border-top-color: ${({ theme }) => theme.colors.borderLight};
  border-left-color: ${({ theme }) => theme.colors.borderLight};
  border-right-color: ${({ theme }) => theme.colors.borderDark};
  border-bottom-color: ${({ theme }) => theme.colors.borderDark};
  padding: ${({ theme }) => theme.spacing.md};
  position: relative;
  
  &:hover .controls {
    opacity: 1;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  display: block;
  image-rendering: pixelated;
  background-color: ${({ theme }) => theme.colors.panelDark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ItemPrompt = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  color: ${({ theme }) => theme.colors.bright.cyan};
`;

const ItemControls = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  opacity: 0;
  transition: opacity 0.2s ease;
  padding: ${({ theme }) => theme.spacing.md};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: ${({ theme }) => theme.borders.panel};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Tab = styled.button`
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.buttonBg};
  color: ${({ theme, active }) => 
    active ? '#000000' : theme.colors.buttonText};
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme, active }) => 
    active ? theme.colors.borderDark : theme.colors.borderLight};
  border-left-color: ${({ theme, active }) => 
    active ? theme.colors.borderDark : theme.colors.borderLight};
  border-right-color: ${({ theme, active }) => 
    active ? theme.colors.borderLight : theme.colors.borderDark};
  border-bottom-color: ${({ theme, active }) => 
    active ? theme.colors.borderLight : theme.colors.borderDark};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fonts.sizes.regular};
  cursor: pointer;
  text-transform: uppercase;
  transform: ${({ active }) => active ? 'translateY(2px)' : 'none'};
`;

function GalleryPage() {
  const { user, deleteImage } = useUserContext();
  const { playSound } = useSoundContext();
  const [activeTab, setActiveTab] = useState('saved');
  const [detailsImage, setDetailsImage] = useState(null);
  
  const handleTabChange = (tab) => {
    playSound('click');
    setActiveTab(tab);
  };
  
  const handleDownload = (image) => {
    playSound('click');
    
    // Create download link
    const a = document.createElement('a');
    a.href = image.url;
    a.download = `pixel-art-${image.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Image downloaded!');
  };
  
  const handleDelete = (image) => {
    playSound('error');
    
    if (confirm('Are you sure you want to delete this image?')) {
      deleteImage(image.id);
      toast.success('Image deleted from gallery!');
    }
  };
  
  const handleViewDetails = (image) => {
    playSound('click');
    setDetailsImage(image);
  };
  
  const handleShare = (image) => {
    playSound('click');
    if (navigator.share) {
      navigator.share({
        title: 'My Pixel Art Creation',
        text: `Check out my pixel art: ${image.prompt}`,
        url: image.url
      })
      .then(() => toast.success('Shared successfully!'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(image.url)
        .then(() => toast.success('Image URL copied to clipboard!'))
        .catch(() => toast.error('Failed to copy URL'));
    }
  };
  
  const renderContent = () => {
    if (activeTab === 'saved') {
      if (!user || user.savedImages.length === 0) {
        return (
          <EmptyGallery>
            <h3>NO SAVED IMAGES YET</h3>
            <p>Generate some pixel art and save it to view it here</p>
          </EmptyGallery>
        );
      }
      
      return (
        <GalleryGrid>
          {user.savedImages.map((image) => (
            <GalleryItem key={image.id}>
              <ItemImage
                src={image.url}
                alt={image.prompt}
              />
              <ItemPrompt>{image.prompt}</ItemPrompt>
              <ItemInfo>
                <span>{image.dimensions}</span>
                <span>{image.style}</span>
              </ItemInfo>
              <ItemControls className="controls">
                <RetroButton onClick={() => handleViewDetails(image)} color="secondary" small>
                  DETAILS
                </RetroButton>
                <RetroButton onClick={() => handleDownload(image)} color="primary" small>
                  DOWNLOAD
                </RetroButton>
                <RetroButton onClick={() => handleShare(image)} color="accent" small>
                  SHARE
                </RetroButton>
                <RetroButton onClick={() => handleDelete(image)} color="accent" small>
                  DELETE
                </RetroButton>
              </ItemControls>
            </GalleryItem>
          ))}
        </GalleryGrid>
      );
    } else {
      if (!user || user.generationHistory.length === 0) {
        return (
          <EmptyGallery>
            <h3>NO GENERATION HISTORY YET</h3>
            <p>Generate some pixel art to see your history</p>
          </EmptyGallery>
        );
      }
      
      return (
        <GalleryGrid>
          {user.generationHistory.map((image) => (
            <GalleryItem key={image.id}>
              <ItemImage
                src={image.url}
                alt={image.prompt}
              />
              <ItemPrompt>{image.prompt}</ItemPrompt>
              <ItemInfo>
                <span>{image.dimensions}</span>
                <span>{image.style}</span>
              </ItemInfo>
              <ItemControls className="controls">
                <RetroButton onClick={() => handleViewDetails(image)} color="secondary" small>
                  DETAILS
                </RetroButton>
                <RetroButton onClick={() => handleDownload(image)} color="primary" small>
                  DOWNLOAD
                </RetroButton>
              </ItemControls>
            </GalleryItem>
          ))}
        </GalleryGrid>
      );
    }
  };
  
  return (
    <PageContainer>
      <PageTitle>Your Pixel Gallery</PageTitle>
      
      <TabsContainer>
        <Tab
          active={activeTab === 'saved' ? 1 : 0}
          onClick={() => handleTabChange('saved')}
        >
          Saved Images
        </Tab>
        <Tab
          active={activeTab === 'history' ? 1 : 0}
          onClick={() => handleTabChange('history')}
        >
          Generation History
        </Tab>
      </TabsContainer>
      
      {renderContent()}
      
      {detailsImage && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: '#222', borderRadius: 12, padding: 32, maxWidth: 600, width: '90%', boxShadow: '0 0 32px #000', position: 'relative'}}>
            <button onClick={() => setDetailsImage(null)} style={{position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer'}}>×</button>
            <img src={detailsImage.url} alt={detailsImage.prompt} style={{width: '100%', maxHeight: 300, objectFit: 'contain', background: '#111', borderRadius: 8}} />
            <div style={{marginTop: 16, color: '#fff'}}>
              <div style={{marginBottom: 8}}><strong>Prompt:</strong> {detailsImage.prompt}</div>
              <div style={{marginBottom: 8}}><strong>Dimensions:</strong> {detailsImage.width} × {detailsImage.height}</div>
              <div style={{marginBottom: 8}}><strong>Style:</strong> {detailsImage.style ? detailsImage.style.toUpperCase() : 'N/A'}</div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default GalleryPage;