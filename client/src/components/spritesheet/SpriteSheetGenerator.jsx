import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaDownload, FaPlus, FaTrash, FaGrid3x3 } from 'react-icons/fa';
import RetroButton from '../ui/RetroButton';
import RetroInput from '../ui/RetroInput';
import RetroSelect from '../ui/RetroSelect';

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
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

const PreviewCanvas = styled.canvas`
  width: 100%;
  max-width: 600px;
  height: auto;
  background: repeating-conic-gradient(#808080 0% 25%, #666 0% 50%) 50% / 20px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
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

const SpriteList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SpriteItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: repeating-conic-gradient(#808080 0% 25%, #666 0% 50%) 50% / 10px 10px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }

  button {
    position: absolute;
    top: 2px;
    right: 2px;
    background: ${props => props.theme.colors.danger};
    border: none;
    color: white;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover button {
    opacity: 1;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled(RetroButton)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ExportButtons = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const MetadataPreview = styled.pre`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1rem;
  font-size: 0.75rem;
  max-height: 200px;
  overflow: auto;
  margin-top: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const SpriteSheetGenerator = () => {
  const [sprites, setSprites] = useState([]);
  const [columns, setColumns] = useState(4);
  const [spacing, setSpacing] = useState(0);
  const [padding, setPadding] = useState(0);
  const [spriteSize, setSpriteSize] = useState(64);
  const [exportFormat, setExportFormat] = useState('json');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (sprites.length > 0) {
      generateSpriteSheet();
    }
  }, [sprites, columns, spacing, padding, spriteSize]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setSprites(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: event.target.result,
            image: img,
            name: file.name
          }]);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSprite = (id) => {
    setSprites(prev => prev.filter(s => s.id !== id));
  };

  const generateSpriteSheet = () => {
    if (!canvasRef.current || sprites.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rows = Math.ceil(sprites.length / columns);
    const totalWidth = (spriteSize * columns) + (spacing * (columns - 1)) + (padding * 2);
    const totalHeight = (spriteSize * rows) + (spacing * (rows - 1)) + (padding * 2);

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, totalWidth, totalHeight);

    // Draw sprites
    sprites.forEach((sprite, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = padding + (col * (spriteSize + spacing));
      const y = padding + (row * (spriteSize + spacing));

      ctx.drawImage(sprite.image, x, y, spriteSize, spriteSize);
    });
  };

  const exportSpriteSheet = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = 'spritesheet.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const exportMetadata = () => {
    const rows = Math.ceil(sprites.length / columns);
    const totalWidth = (spriteSize * columns) + (spacing * (columns - 1)) + (padding * 2);
    const totalHeight = (spriteSize * rows) + (spacing * (rows - 1)) + (padding * 2);

    const frames = sprites.map((sprite, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = padding + (col * (spriteSize + spacing));
      const y = padding + (row * (spriteSize + spacing));

      return {
        filename: sprite.name,
        frame: { x, y, w: spriteSize, h: spriteSize },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: spriteSize, h: spriteSize },
        sourceSize: { w: spriteSize, h: spriteSize }
      };
    });

    let metadata;

    if (exportFormat === 'json') {
      metadata = JSON.stringify({
        frames: frames.reduce((acc, frame, i) => {
          acc[sprites[i].name] = frame;
          return acc;
        }, {}),
        meta: {
          app: "PixPotion Sprite Sheet Generator",
          version: "1.0",
          image: "spritesheet.png",
          format: "RGBA8888",
          size: { w: totalWidth, h: totalHeight },
          scale: "1"
        }
      }, null, 2);
    } else if (exportFormat === 'xml') {
      metadata = `<?xml version="1.0" encoding="UTF-8"?>
<TextureAtlas imagePath="spritesheet.png">
${frames.map((frame, i) =>
  `  <SubTexture name="${sprites[i].name}" x="${frame.frame.x}" y="${frame.frame.y}" width="${frame.frame.w}" height="${frame.frame.h}"/>`
).join('\n')}
</TextureAtlas>`;
    } else if (exportFormat === 'css') {
      metadata = `.sprite {
  background-image: url('spritesheet.png');
  display: inline-block;
  width: ${spriteSize}px;
  height: ${spriteSize}px;
}

${frames.map((frame, i) =>
  `.sprite-${i} {
  background-position: -${frame.frame.x}px -${frame.frame.y}px;
}`
).join('\n\n')}`;
    }

    const blob = new Blob([metadata], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `spritesheet.${exportFormat}`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const getMetadataPreview = () => {
    if (sprites.length === 0) return '';

    const frames = sprites.slice(0, 2).map((sprite, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = padding + (col * (spriteSize + spacing));
      const y = padding + (row * (spriteSize + spacing));

      return { name: sprite.name, x, y, w: spriteSize, h: spriteSize };
    });

    if (exportFormat === 'json') {
      return JSON.stringify({ frames: frames.slice(0, 1) }, null, 2) + '\n...';
    } else if (exportFormat === 'xml') {
      return frames.map(f => `<SubTexture name="${f.name}" x="${f.x}" y="${f.y}"/>`).join('\n') + '\n...';
    } else {
      return `.sprite-0 {\n  background-position: -${frames[0].x}px -${frames[0].y}px;\n}\n...`;
    }
  };

  return (
    <Container>
      <Header>
        <h1>
          <FaGrid3x3 />
          Sprite Sheet Generator
        </h1>
        <p>Combine multiple sprites into optimized sprite sheets with automatic metadata generation</p>
      </Header>

      <Grid>
        <PreviewSection>
          <h3>Preview</h3>
          <PreviewCanvas ref={canvasRef} />

          {sprites.length > 0 && (
            <ExportButtons>
              <RetroButton onClick={exportSpriteSheet}>
                <FaDownload /> Export Sprite Sheet (PNG)
              </RetroButton>
              <RetroButton onClick={exportMetadata} variant="secondary">
                <FaDownload /> Export Metadata ({exportFormat.toUpperCase()})
              </RetroButton>
            </ExportButtons>
          )}

          {sprites.length > 0 && (
            <MetadataPreview>{getMetadataPreview()}</MetadataPreview>
          )}
        </PreviewSection>

        <ControlsSection>
          <ControlGroup>
            <label>Upload Sprites</label>
            <FileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
            />
            <UploadButton onClick={() => fileInputRef.current?.click()}>
              <FaPlus /> Add Sprites
            </UploadButton>

            <SpriteList>
              {sprites.map(sprite => (
                <SpriteItem key={sprite.id}>
                  <img src={sprite.url} alt={sprite.name} />
                  <button onClick={() => removeSprite(sprite.id)}>
                    <FaTrash />
                  </button>
                </SpriteItem>
              ))}
            </SpriteList>
          </ControlGroup>

          <ControlGroup>
            <label>Columns</label>
            <RetroInput
              type="number"
              min="1"
              max="20"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
            />
          </ControlGroup>

          <ControlGroup>
            <label>Sprite Size (px)</label>
            <RetroInput
              type="number"
              min="16"
              max="512"
              step="8"
              value={spriteSize}
              onChange={(e) => setSpriteSize(parseInt(e.target.value) || 64)}
            />
          </ControlGroup>

          <ControlGroup>
            <label>Spacing (px)</label>
            <RetroInput
              type="number"
              min="0"
              max="32"
              value={spacing}
              onChange={(e) => setSpacing(parseInt(e.target.value) || 0)}
            />
          </ControlGroup>

          <ControlGroup>
            <label>Padding (px)</label>
            <RetroInput
              type="number"
              min="0"
              max="32"
              value={padding}
              onChange={(e) => setPadding(parseInt(e.target.value) || 0)}
            />
          </ControlGroup>

          <ControlGroup>
            <label>Export Format</label>
            <RetroSelect
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="json">JSON (TexturePacker)</option>
              <option value="xml">XML (Starling)</option>
              <option value="css">CSS Sprites</option>
            </RetroSelect>
          </ControlGroup>
        </ControlsSection>
      </Grid>
    </Container>
  );
};

export default SpriteSheetGenerator;
