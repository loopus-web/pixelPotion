import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaDownload, FaRedo, FaCopy } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import RetroButton from '../ui/RetroButton';
import RetroInput from '../ui/RetroInput';
import RetroSelect from '../ui/RetroSelect';
import api from '../../utils/api';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const PreviewSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  border-radius: 4px;
`;

const TilesetCanvas = styled.canvas`
  width: 100%;
  max-width: 600px;
  height: auto;
  background: repeating-conic-gradient(#808080 0% 25%, #666 0% 50%) 50% / 20px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  image-rendering: pixelated;
  margin-bottom: 1rem;
`;

const ControlsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  border-radius: 4px;
`;

const ControlGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  max-height: 400px;
  overflow-y: auto;
`;

const TileItem = styled.div`
  aspect-ratio: 1;
  background: repeating-conic-gradient(#808080 0% 25%, #666 0% 50%) 50% / 10px 10px;
  border: 2px solid ${props => props.theme.colors.border};
  position: relative;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }

  .tile-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: ${props => props.theme.colors.primary};
    font-size: 0.7rem;
    padding: 2px;
    text-align: center;
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TemplateButton = styled(RetroButton)`
  justify-content: flex-start;
  font-size: 0.85rem;
`;

const ExportButtons = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  gap: 1rem;

  .spinner {
    border: 4px solid ${props => props.theme.colors.border};
    border-top: 4px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TileSetGenerator = () => {
  const { user } = useUser();
  const [tilesetType, setTilesetType] = useState('platform');
  const [tileSize, setTileSize] = useState(16);
  const [theme, setTheme] = useState('grass');
  const [tiles, setTiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  // Tileset templates
  const templates = {
    platform: {
      name: 'Platform Tileset',
      tiles: ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right', 'single'],
      description: 'Complete platform tileset with corners and edges'
    },
    terrain: {
      name: 'Auto-tile Terrain',
      tiles: ['base', 'slope-left', 'slope-right', 'cliff-top', 'cliff-bottom', 'corner-tl', 'corner-tr', 'corner-bl', 'corner-br'],
      description: 'Advanced terrain with slopes and cliffs'
    },
    dungeon: {
      name: 'Dungeon Tiles',
      tiles: ['floor', 'wall-top', 'wall-side', 'door', 'corner', 'pillar', 'stairs', 'crack'],
      description: 'Classic dungeon tileset'
    },
    nature: {
      name: 'Nature Pack',
      tiles: ['grass', 'dirt', 'stone', 'water', 'sand', 'tree', 'bush', 'flower'],
      description: 'Natural environment tiles'
    }
  };

  const themes = {
    grass: 'Grassy Plains',
    desert: 'Desert Sands',
    ice: 'Frozen Tundra',
    lava: 'Volcanic',
    space: 'Space Station',
    cyberpunk: 'Cyberpunk City',
    medieval: 'Medieval Castle',
    forest: 'Dense Forest'
  };

  useEffect(() => {
    if (tiles.length > 0) {
      generateTilesetPreview();
    }
  }, [tiles, tileSize]);

  const generateTileset = async () => {
    if (!user) {
      alert('Please login to generate tilesets');
      return;
    }

    setIsGenerating(true);

    try {
      const template = templates[tilesetType];
      const generatedTiles = [];

      // In a real app, this would call the AI generation API for each tile type
      for (const tileType of template.tiles) {
        const prompt = `pixel art ${tileType} tile for ${theme} themed ${tilesetType} tileset, ${tileSize}x${tileSize} pixels, game asset, top-down view`;

        // Simulating API call - in production, this would call your AI generation endpoint
        // const response = await api.post('/images/generate', {
        //   prompt,
        //   width: tileSize,
        //   height: tileSize,
        //   style: 'pixel-art'
        // });

        // For now, create placeholder
        const canvas = document.createElement('canvas');
        canvas.width = tileSize;
        canvas.height = tileSize;
        const ctx = canvas.getContext('2d');

        // Draw placeholder tile
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
        ctx.fillRect(0, 0, tileSize, tileSize);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(0, 0, tileSize, tileSize);

        const img = new Image();
        img.src = canvas.toDataURL();
        await new Promise(resolve => img.onload = resolve);

        generatedTiles.push({
          id: Date.now() + Math.random(),
          type: tileType,
          image: img,
          url: canvas.toDataURL()
        });

        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setTiles(generatedTiles);
    } catch (error) {
      console.error('Error generating tileset:', error);
      alert('Failed to generate tileset. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTilesetPreview = () => {
    if (!canvasRef.current || tiles.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const cols = Math.ceil(Math.sqrt(tiles.length));
    const rows = Math.ceil(tiles.length / cols);

    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tiles.forEach((tile, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * tileSize;
      const y = row * tileSize;

      ctx.drawImage(tile.image, x, y, tileSize, tileSize);
    });
  };

  const exportTileset = () => {
    if (!canvasRef.current || tiles.length === 0) return;

    const link = document.createElement('a');
    link.download = `tileset-${tilesetType}-${theme}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const exportMetadata = () => {
    if (tiles.length === 0) return;

    const cols = Math.ceil(Math.sqrt(tiles.length));

    const metadata = {
      tileset: {
        name: `${theme} ${tilesetType}`,
        tileSize: tileSize,
        columns: cols,
        rows: Math.ceil(tiles.length / cols),
        tileCount: tiles.length,
        tiles: tiles.map((tile, index) => ({
          id: index,
          type: tile.type,
          x: (index % cols) * tileSize,
          y: Math.floor(index / cols) * tileSize,
          width: tileSize,
          height: tileSize
        }))
      }
    };

    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `tileset-${tilesetType}-${theme}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const exportForGameEngine = (engine) => {
    if (tiles.length === 0) return;

    const cols = Math.ceil(Math.sqrt(tiles.length));
    let exportData = '';

    if (engine === 'godot') {
      exportData = `[remap]

importer="texture"
type="StreamTexture"
path="res://.import/tileset.png"

[params]
compress/mode=0
flags/filter=false
flags/mipmaps=false
flags/anisotropic=false
flags/srgb=2

[tileset]
tile_size = Vector2(${tileSize}, ${tileSize})
columns = ${cols}`;
    } else if (engine === 'unity') {
      exportData = JSON.stringify({
        textureImporter: {
          spriteMode: 2,
          spritePixelsPerUnit: tileSize,
          spritePivot: { x: 0.5, y: 0.5 },
          spriteSheet: {
            sprites: tiles.map((tile, i) => ({
              name: tile.type,
              rect: {
                x: (i % cols) * tileSize,
                y: Math.floor(i / cols) * tileSize,
                width: tileSize,
                height: tileSize
              }
            }))
          }
        }
      }, null, 2);
    } else if (engine === 'tiled') {
      exportData = `<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.0" tiledversion="1.0" name="${theme}-${tilesetType}" tilewidth="${tileSize}" tileheight="${tileSize}" tilecount="${tiles.length}" columns="${cols}">
 <image source="tileset-${tilesetType}-${theme}.png" width="${cols * tileSize}" height="${Math.ceil(tiles.length / cols) * tileSize}"/>
${tiles.map((tile, i) => `  <tile id="${i}" type="${tile.type}"/>`).join('\n')}
</tileset>`;
    }

    const blob = new Blob([exportData], { type: 'text/plain' });
    const link = document.createElement('a');
    const extension = engine === 'tiled' ? 'tsx' : engine === 'unity' ? 'json' : 'tres';
    link.download = `tileset-${tilesetType}-${theme}.${extension}`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <Container>
      <Header>
        <h1>🗺️ Tileset Generator</h1>
        <p>Generate complete, cohesive tilesets for your game levels with auto-tiling support</p>
      </Header>

      <Grid>
        <PreviewSection style={{ position: 'relative' }}>
          <h3>Tileset Preview</h3>
          <TilesetCanvas ref={canvasRef} />

          {isGenerating && (
            <LoadingOverlay>
              <div className="spinner"></div>
              <div>Generating tileset...</div>
            </LoadingOverlay>
          )}

          {tiles.length > 0 && (
            <ExportButtons>
              <RetroButton onClick={exportTileset}>
                <FaDownload /> Export Tileset (PNG)
              </RetroButton>
              <RetroButton onClick={exportMetadata} variant="secondary">
                <FaDownload /> Export Metadata (JSON)
              </RetroButton>
            </ExportButtons>
          )}

          {tiles.length > 0 && (
            <>
              <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Individual Tiles</h4>
              <TileGrid>
                {tiles.map(tile => (
                  <TileItem key={tile.id}>
                    <img src={tile.url} alt={tile.type} />
                    <div className="tile-label">{tile.type}</div>
                  </TileItem>
                ))}
              </TileGrid>
            </>
          )}
        </PreviewSection>

        <ControlsSection>
          <ControlGroup>
            <label>Tileset Template</label>
            <TemplateGrid>
              {Object.entries(templates).map(([key, template]) => (
                <TemplateButton
                  key={key}
                  onClick={() => setTilesetType(key)}
                  variant={tilesetType === key ? 'primary' : 'secondary'}
                >
                  {template.name}
                  <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{template.tiles.length} tiles</div>
                </TemplateButton>
              ))}
            </TemplateGrid>
          </ControlGroup>

          <ControlGroup>
            <label>Theme</label>
            <RetroSelect value={theme} onChange={(e) => setTheme(e.target.value)}>
              {Object.entries(themes).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </RetroSelect>
          </ControlGroup>

          <ControlGroup>
            <label>Tile Size (px)</label>
            <RetroSelect value={tileSize} onChange={(e) => setTileSize(parseInt(e.target.value))}>
              <option value="8">8x8</option>
              <option value="16">16x16</option>
              <option value="32">32x32</option>
              <option value="64">64x64</option>
            </RetroSelect>
          </ControlGroup>

          <ControlGroup>
            <RetroButton onClick={generateTileset} disabled={isGenerating}>
              <FaRedo /> Generate Complete Tileset
            </RetroButton>
          </ControlGroup>

          {tiles.length > 0 && (
            <ControlGroup>
              <label>Export for Game Engine</label>
              <TemplateGrid>
                <RetroButton onClick={() => exportForGameEngine('godot')} variant="secondary" size="small">
                  Godot (.tres)
                </RetroButton>
                <RetroButton onClick={() => exportForGameEngine('unity')} variant="secondary" size="small">
                  Unity (.json)
                </RetroButton>
                <RetroButton onClick={() => exportForGameEngine('tiled')} variant="secondary" size="small">
                  Tiled (.tsx)
                </RetroButton>
              </TemplateGrid>
            </ControlGroup>
          )}
        </ControlsSection>
      </Grid>
    </Container>
  );
};

export default TileSetGenerator;
