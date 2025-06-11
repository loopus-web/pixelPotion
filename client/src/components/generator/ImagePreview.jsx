import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';
import { useUserContext } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import RetroButton from '../ui/RetroButton';
import { toast } from 'react-toastify';

const StyledPreviewCard = styled.div`
  max-width: 1200px;
  margin: 32px auto;
  width: 95%;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.panel},
    ${({ theme }) => theme.colors.panelDark}
  );
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.strong};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.colors.border};
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, 
      ${({ theme }) => theme.colors.primary}00, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.primary}00
    );
    z-index: 1;
  }
`;

const StyledHeader = styled.div`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.panelDark};
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary}30;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.sizes.large};
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '>';
    margin-right: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 80%;
    animation: blink 1.2s step-end infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

const StyledImageWrapper = styled.div`
  position: relative;
  background: #111;
  background-image: linear-gradient(45deg, #0a0a0a 25%, transparent 25%), 
                    linear-gradient(-45deg, #0a0a0a 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #0a0a0a 75%), 
                    linear-gradient(-45deg, transparent 75%, #0a0a0a 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 400px;
  }
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease;
  cursor: grab;
  image-rendering: pixelated;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const StyledToolbar = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.panelDark}cc;
  backdrop-filter: blur(5px);
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    justify-content: center;
    width: 90%;
  }
`;

const StyledInfoPanel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.panelDark};
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ZoomSlider = styled.input`
  width: 120px;
  appearance: none;
  height: 6px;
  background: ${({ theme }) => theme.colors.panelDark};
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}80;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}80;
    border: none;
  }
  
  &:hover::-webkit-slider-thumb {
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
  
  &:hover::-moz-range-thumb {
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
`;

const ZoomContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  .zoom-label {
    font-size: ${({ theme }) => theme.fonts.sizes.small};
    color: ${({ theme }) => theme.colors.secondary};
    min-width: 60px;
  }
`;

const Details = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const DetailItem = styled.div`
  .label {
    font-size: ${({ theme }) => theme.fonts.sizes.xsmall};
    color: ${({ theme }) => theme.colors.primary}80;
    text-transform: uppercase;
  }
  .value {
    font-size: ${({ theme }) => theme.fonts.sizes.small};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
`;

const PixelLoadingAnimation = styled.div`
  width: 128px;
  height: 128px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  
  .pixel-canvas {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    grid-template-rows: repeat(16, 1fr);
    width: 100%;
    height: 100%;
  }
  
  .pixel {
    transition: background-color 0.3s ease;
  }
  
  .loading-text {
    margin-top: 20px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fonts.sizes.medium};
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 100%;
`;

const NoImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fonts.sizes.medium};
  text-align: center;
  
  .icon {
    font-size: 48px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.7;
  }
  
  .message {
    max-width: 300px;
    line-height: 1.5;
  }
`;

const ActionButton = styled(RetroButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  .icon {
    font-size: 16px;
  }
  
  .label {
    font-size: ${({ theme }) => theme.fonts.sizes.small};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none;
    }
  }
`;

const PromptDisplay = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.panel}70;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  max-height: 60px;
  overflow: auto;
  
  .prompt-label {
    font-size: ${({ theme }) => theme.fonts.sizes.xsmall};
    color: ${({ theme }) => theme.colors.primary}80;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    text-transform: uppercase;
  }
  
  .prompt-text {
    font-size: ${({ theme }) => theme.fonts.sizes.small};
    color: ${({ theme }) => theme.colors.text};
    font-style: italic;
  }
`;

const StorageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
  color: ${({ theme, full }) => full ? theme.colors.error : theme.colors.secondary};
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  
  .storage-icon {
    font-size: ${({ theme }) => theme.fonts.sizes.medium};
  }
  
  .upgrade-link {
    margin-left: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.accent};
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: ${({ theme }) => theme.colors.bright.yellow};
    }
  }
`;

function ImagePreview({ image }) {
  const { playSound } = useSoundContext();
  const { 
    user, 
    saveImage, 
    getMaxGalleryImages, 
    canStoreMoreImages, 
    getPlanRequirementText 
  } = useUserContext();
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showPrompt, setShowPrompt] = useState(false);
  const [pixelGrid, setPixelGrid] = useState([]);
  
  // Génère une grille de pixels pour l'animation de chargement
  useEffect(() => {
    const colors = [
      '#ff004d', '#ffa300', '#ffec27', 
      '#00e436', '#29adff', '#83769c',
      '#ff77a8', '#ffccaa'
    ];
    
    const grid = Array(16 * 16).fill(null).map((_, i) => ({
      id: i,
      color: 'transparent'
    }));
    
    setPixelGrid(grid);
    
    // Animation uniquement si en chargement
    if (!image || image.isLoading) {
      const interval = setInterval(() => {
        setPixelGrid(prev => {
          const newGrid = [...prev];
          // Anime quelques pixels aléatoires
          for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * newGrid.length);
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            newGrid[randomIndex] = {
              ...newGrid[randomIndex],
              color: Math.random() > 0.5 ? randomColor : 'transparent'
            };
          }
          return newGrid;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [image]);
  
  // Get storage limits from plan
  const maxGalleryImages = getMaxGalleryImages();
  const currentStorageCount = user?.savedImages?.length || 0;
  const isStorageFull = !canStoreMoreImages();
  
  const handleZoomIn = () => {
    playSound('click');
    setZoom(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    playSound('click');
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const handleResetZoom = () => {
    playSound('click');
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      const maxOffset = 100 * (zoom - 1);
      const newX = Math.min(Math.max(e.clientX - dragStart.x, -maxOffset), maxOffset);
      const newY = Math.min(Math.max(e.clientY - dragStart.y, -maxOffset), maxOffset);
      
      setPosition({
        x: newX,
        y: newY
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  const handleSave = async () => {
    playSound('save');
    
    if (!user) {
      toast.warning('Please log in to save images to your gallery');
      return;
    }
    
    // Check if user has reached the storage limit
    if (!canStoreMoreImages()) {
      toast.error(`Gallery storage limit reached (${currentStorageCount}/${maxGalleryImages}). ${getPlanRequirementText('gallery')}`);
      playSound('error');
      return;
    }
    
    const ok = await saveImage(image);
    if (ok) {
      toast.success('Image saved to gallery!');
    } else {
      toast.error('Failed to upload image');
    }
  };
  
  const handleDownload = () => {
    playSound('click');
    
    // Create download link
    const a = document.createElement('a');
    a.href = image.url;
    a.download = `pixpotion-${image.id || Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Image downloaded!');
  };
  
  const handleShare = () => {
    playSound('click');
    // Handle data URLs
    let shareUrl = image.url;
    if (shareUrl && shareUrl.startsWith('data:')) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Image URL copied to clipboard!'))
        .catch(() => toast.error('Failed to copy URL'));
      toast.info('Direct sharing is only possible with a public URL.');
      return;
    }
    
    if (navigator.share) {
      navigator.share({
        title: 'My PixPotion Art Creation',
        text: `Check out my pixel art: ${image.prompt}`,
        url: shareUrl
      })
      .then(() => toast.success('Shared successfully!'))
      .catch((error) => {
        toast.error('Sharing failed');
        console.error('Error sharing:', error);
      });
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Image URL copied to clipboard!'))
        .catch(() => toast.error('Failed to copy URL'));
    }
  };
  
  return (
    <StyledPreviewCard>
      <StyledHeader>
        <PreviewTitle>Preview</PreviewTitle>
        {user && (
          <StorageInfo full={isStorageFull}>
            <span className="storage-icon">💾</span>
            <span>{currentStorageCount}/{maxGalleryImages}</span>
            {isStorageFull && (
              <span className="upgrade-link" onClick={() => window.location.href = '/plans'}>
                Upgrade Plan
              </span>
            )}
          </StorageInfo>
        )}
      </StyledHeader>
      
      <StyledImageWrapper
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {image && !image.isLoading ? (
          <>
            <StyledImage
              src={image.url}
              alt="Generated Pixel Art"
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
            />
            <StyledToolbar>
              <ActionButton onClick={handleZoomOut} small color="secondary">
                <span className="icon">-</span>
              </ActionButton>
              <ActionButton onClick={handleResetZoom} small color="secondary">
                <span className="icon">⟳</span>
              </ActionButton>
              <ActionButton onClick={handleZoomIn} small color="secondary">
                <span className="icon">+</span>
              </ActionButton>
              <ActionButton 
                onClick={handleSave} 
                color="primary"
                disabled={isStorageFull && user}
                title={isStorageFull ? `Gallery storage limit reached (${getPlanRequirementText('gallery')})` : "Save to Gallery"}
              >
                <span className="icon">💾</span>
                <span className="label">Save</span>
              </ActionButton>
              <ActionButton onClick={handleDownload} color="accent">
                <span className="icon">⬇️</span>
                <span className="label">Download</span>
              </ActionButton>
              <ActionButton onClick={handleShare} color="secondary">
                <span className="icon">↗️</span>
                <span className="label">Share</span>
              </ActionButton>
            </StyledToolbar>
          </>
        ) : image && image.isLoading ? (
          <LoadingContainer>
            <PixelLoadingAnimation>
              <div className="pixel-canvas">
                {pixelGrid.map(pixel => (
                  <div
                    key={pixel.id}
                    className="pixel"
                    style={{ backgroundColor: pixel.color }}
                  />
                ))}
              </div>
            </PixelLoadingAnimation>
            <div className="loading-text">Generating Pixel Art...</div>
          </LoadingContainer>
        ) : (
          <NoImage>
            <div className="icon">🖼️</div>
            <div className="message">
              Create pixel art by entering a prompt and generating
            </div>
          </NoImage>
        )}
      </StyledImageWrapper>
      
      {image && !image.isLoading && (
        <>
          {image.prompt && (
            <PromptDisplay>
              <div className="prompt-label">Prompt</div>
              <div className="prompt-text">{image.prompt}</div>
            </PromptDisplay>
          )}
          
          <StyledInfoPanel>
            <Details>
              <DetailItem>
                <div className="label">DIMENSIONS</div>
                <div className="value">{image.width}×{image.height}</div>
              </DetailItem>
              <DetailItem>
                <div className="label">STYLE</div>
                <div className="value">{image.style?.toUpperCase() || 'N/A'}</div>
              </DetailItem>
              <DetailItem>
                <div className="label">SEED</div>
                <div className="value">{image.seed}</div>
              </DetailItem>
            </Details>
            
            <ZoomContainer>
              <span className="zoom-label">Zoom: {zoom.toFixed(2)}x</span>
              <ZoomSlider
                type="range"
                min="0.5"
                max="3"
                step="0.25"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
              />
            </ZoomContainer>
          </StyledInfoPanel>
        </>
      )}
    </StyledPreviewCard>
  );
}

export default ImagePreview;