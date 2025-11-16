import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaTrash, FaCopy, FaDownload, FaPalette, FaRandom } from 'react-icons/fa';
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
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: ${props => props.theme.colors.breakpoints?.tablet || '768px'}) {
    grid-template-columns: 1fr;
  }
`;

const PaletteSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  border-radius: 4px;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ColorSwatch = styled.div`
  aspect-ratio: 1;
  background: ${props => props.color};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: scale(1.05);
    border-color: ${props => props.theme.colors.primary};
  }

  .color-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    font-size: 0.7rem;
    padding: 4px;
    text-align: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .color-info {
    opacity: 1;
  }

  .delete-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: ${props => props.theme.colors.danger};
    border: none;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    font-size: 0.7rem;
  }

  &:hover .delete-btn {
    opacity: 1;
  }
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

const ColorPicker = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 50px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.value};
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PresetButton = styled(RetroButton)`
  font-size: 0.8rem;
  padding: 0.5rem;
`;

const ExportButtons = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PalettePreview = styled.div`
  display: flex;
  height: 60px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const PreviewStripe = styled.div`
  flex: 1;
  background: ${props => props.color};
`;

const SavedPalettes = styled.div`
  margin-top: 2rem;
`;

const SavedPaletteItem = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;

  .palette-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    h4 {
      margin: 0;
      color: ${props => props.theme.colors.primary};
      font-size: 0.9rem;
    }
  }

  .palette-colors {
    display: flex;
    gap: 4px;
    margin-bottom: 0.5rem;
  }

  .palette-color {
    width: 30px;
    height: 30px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 2px;
  }

  .palette-actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const ColorPaletteManager = () => {
  const [currentPalette, setCurrentPalette] = useState([]);
  const [paletteName, setPaletteName] = useState('My Palette');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [savedPalettes, setSavedPalettes] = useState([]);

  // Professional preset palettes
  const presets = {
    gameboy: {
      name: 'Game Boy',
      colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f']
    },
    pico8: {
      name: 'PICO-8',
      colors: ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA']
    },
    nes: {
      name: 'NES',
      colors: ['#7C7C7C', '#0000FC', '#0000BC', '#4428BC', '#940084', '#A80020', '#A81000', '#881400', '#503000', '#007800', '#006800', '#005800', '#004058', '#000000']
    },
    commodore64: {
      name: 'C64',
      colors: ['#000000', '#FFFFFF', '#880000', '#AAFFEE', '#CC44CC', '#00CC55', '#0000AA', '#EEEE77', '#DD8855', '#664400', '#FF7777', '#333333', '#777777', '#AAFF66', '#0088FF', '#BBBBBB']
    },
    earthbound: {
      name: 'Earthbound',
      colors: ['#000000', '#1C1C1C', '#383838', '#545454', '#707070', '#8C8C8C', '#A8A8A8', '#C4C4C4', '#E0E0E0', '#FFFFFF']
    },
    nord: {
      name: 'Nord',
      colors: ['#2E3440', '#3B4252', '#434C5E', '#4C566A', '#D8DEE9', '#E5E9F0', '#ECEFF4', '#8FBCBB', '#88C0D0', '#81A1C1', '#5E81AC', '#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD']
    },
    dracula: {
      name: 'Dracula',
      colors: ['#282A36', '#44475A', '#F8F8F2', '#6272A4', '#8BE9FD', '#50FA7B', '#FFB86C', '#FF79C6', '#BD93F9', '#FF5555']
    },
    sunset: {
      name: 'Sunset',
      colors: ['#2D1B2E', '#5D275D', '#B13E53', '#EF7D57', '#FFCD75', '#A7F070', '#38B764', '#257179', '#29366F', '#3B5DC9']
    }
  };

  const addColor = () => {
    if (currentPalette.length < 32) {
      setCurrentPalette([...currentPalette, selectedColor]);
    }
  };

  const removeColor = (index) => {
    setCurrentPalette(currentPalette.filter((_, i) => i !== index));
  };

  const loadPreset = (presetKey) => {
    setCurrentPalette(presets[presetKey].colors);
    setPaletteName(presets[presetKey].name);
  };

  const generateRandomPalette = () => {
    const count = Math.floor(Math.random() * 8) + 4; // 4-12 colors
    const palette = [];

    for (let i = 0; i < count; i++) {
      const hue = Math.floor(Math.random() * 360);
      const sat = Math.floor(Math.random() * 40) + 60; // 60-100%
      const light = Math.floor(Math.random() * 40) + 30; // 30-70%
      palette.push(hslToHex(hue, sat, light));
    }

    setCurrentPalette(palette);
    setPaletteName('Random Palette');
  };

  const generateHarmonious = (type) => {
    const baseHue = Math.floor(Math.random() * 360);
    let hues = [];

    switch (type) {
      case 'complementary':
        hues = [baseHue, (baseHue + 180) % 360];
        break;
      case 'triadic':
        hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
        break;
      case 'analogous':
        hues = [baseHue, (baseHue + 30) % 360, (baseHue + 60) % 360, (baseHue - 30 + 360) % 360];
        break;
      case 'monochromatic':
        hues = [baseHue];
        break;
    }

    const palette = [];
    hues.forEach(hue => {
      // Generate variations with different lightness
      [20, 40, 60, 80].forEach(light => {
        palette.push(hslToHex(hue, 70, light));
      });
    });

    setCurrentPalette(palette);
    setPaletteName(`${type.charAt(0).toUpperCase() + type.slice(1)} Harmony`);
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const savePalette = () => {
    if (currentPalette.length === 0) return;

    const newPalette = {
      id: Date.now(),
      name: paletteName,
      colors: [...currentPalette]
    };

    setSavedPalettes([newPalette, ...savedPalettes]);
  };

  const loadSavedPalette = (palette) => {
    setCurrentPalette(palette.colors);
    setPaletteName(palette.name);
  };

  const deleteSavedPalette = (id) => {
    setSavedPalettes(savedPalettes.filter(p => p.id !== id));
  };

  const exportPalette = (format) => {
    if (currentPalette.length === 0) return;

    let content = '';
    const filename = `${paletteName.toLowerCase().replace(/\s+/g, '-')}`;

    switch (format) {
      case 'hex':
        content = currentPalette.join('\n');
        break;
      case 'json':
        content = JSON.stringify({ name: paletteName, colors: currentPalette }, null, 2);
        break;
      case 'css':
        content = `:root {\n${currentPalette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
        break;
      case 'ase':
        alert('ASE export requires binary format. Use hex or JSON for now.');
        return;
      case 'gpl':
        content = `GIMP Palette\nName: ${paletteName}\n#\n${currentPalette.map(c => {
          const r = parseInt(c.slice(1, 3), 16);
          const g = parseInt(c.slice(3, 5), 16);
          const b = parseInt(c.slice(5, 7), 16);
          return `${r.toString().padStart(3)} ${g.toString().padStart(3)} ${b.toString().padStart(3)}`;
        }).join('\n')}`;
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentPalette.join(', '));
    alert('Palette copied to clipboard!');
  };

  return (
    <Container>
      <Header>
        <h1>
          <FaPalette />
          Color Palette Manager
        </h1>
        <p>Create, manage, and export professional color palettes for your pixel art projects</p>
      </Header>

      <Grid>
        <PaletteSection>
          <h3>{paletteName} ({currentPalette.length} colors)</h3>

          <PalettePreview>
            {currentPalette.map((color, i) => (
              <PreviewStripe key={i} color={color} />
            ))}
          </PalettePreview>

          <ColorGrid>
            {currentPalette.map((color, index) => (
              <ColorSwatch key={index} color={color}>
                <div className="color-info">{color.toUpperCase()}</div>
                <button className="delete-btn" onClick={() => removeColor(index)}>
                  <FaTrash />
                </button>
              </ColorSwatch>
            ))}
          </ColorGrid>

          {currentPalette.length > 0 && (
            <ExportButtons>
              <RetroButton onClick={savePalette}>
                Save Palette
              </RetroButton>
              <RetroButton onClick={copyToClipboard} variant="secondary">
                <FaCopy /> Copy Hex Codes
              </RetroButton>
            </ExportButtons>
          )}

          <SavedPalettes>
            <h4>Saved Palettes ({savedPalettes.length})</h4>
            {savedPalettes.map(palette => (
              <SavedPaletteItem key={palette.id}>
                <div className="palette-header">
                  <h4>{palette.name}</h4>
                  <span>{palette.colors.length} colors</span>
                </div>
                <div className="palette-colors">
                  {palette.colors.map((color, i) => (
                    <div key={i} className="palette-color" style={{ background: color }} />
                  ))}
                </div>
                <div className="palette-actions">
                  <RetroButton size="small" onClick={() => loadSavedPalette(palette)}>
                    Load
                  </RetroButton>
                  <RetroButton size="small" variant="secondary" onClick={() => deleteSavedPalette(palette.id)}>
                    <FaTrash />
                  </RetroButton>
                </div>
              </SavedPaletteItem>
            ))}
          </SavedPalettes>
        </PaletteSection>

        <ControlsSection>
          <ControlGroup>
            <label>Palette Name</label>
            <RetroInput
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="Enter palette name"
            />
          </ControlGroup>

          <ControlGroup>
            <label>Add Color</label>
            <ColorPicker>
              <ColorInput
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
              <RetroInput
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#RRGGBB"
              />
              <RetroButton onClick={addColor} disabled={currentPalette.length >= 32}>
                <FaPlus /> Add Color
              </RetroButton>
            </ColorPicker>
          </ControlGroup>

          <ControlGroup>
            <label>Generate</label>
            <PresetGrid>
              <PresetButton onClick={generateRandomPalette}>
                <FaRandom /> Random
              </PresetButton>
              <PresetButton onClick={() => generateHarmonious('complementary')}>
                Complementary
              </PresetButton>
              <PresetButton onClick={() => generateHarmonious('triadic')}>
                Triadic
              </PresetButton>
              <PresetButton onClick={() => generateHarmonious('analogous')}>
                Analogous
              </PresetButton>
            </PresetGrid>
          </ControlGroup>

          <ControlGroup>
            <label>Presets</label>
            <PresetGrid>
              {Object.entries(presets).map(([key, preset]) => (
                <PresetButton key={key} onClick={() => loadPreset(key)} variant="secondary">
                  {preset.name}
                </PresetButton>
              ))}
            </PresetGrid>
          </ControlGroup>

          {currentPalette.length > 0 && (
            <ControlGroup>
              <label>Export</label>
              <ExportButtons>
                <RetroButton onClick={() => exportPalette('hex')} variant="secondary" size="small">
                  <FaDownload /> HEX
                </RetroButton>
                <RetroButton onClick={() => exportPalette('json')} variant="secondary" size="small">
                  <FaDownload /> JSON
                </RetroButton>
                <RetroButton onClick={() => exportPalette('css')} variant="secondary" size="small">
                  <FaDownload /> CSS
                </RetroButton>
                <RetroButton onClick={() => exportPalette('gpl')} variant="secondary" size="small">
                  <FaDownload /> GIMP (.gpl)
                </RetroButton>
              </ExportButtons>
            </ControlGroup>
          )}
        </ControlsSection>
      </Grid>
    </Container>
  );
};

export default ColorPaletteManager;
