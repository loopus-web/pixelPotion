import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRocket, FaDownload, FaCheck, FaTimes } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import RetroButton from '../ui/RetroButton';
import RetroInput from '../ui/RetroInput';
import RetroSelect from '../ui/RetroSelect';
import RetroSlider from '../ui/RetroSlider';

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
  grid-template-columns: 400px 1fr;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints?.tablet || '768px'}) {
    grid-template-columns: 1fr;
  }
`;

const ControlsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  border-radius: 4px;
  height: fit-content;
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

const ResultsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  border-radius: 4px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  max-height: 70vh;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.isSuccess ? props.theme.colors.success : props.isError ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: 4px;
  padding: 1rem;
  position: relative;

  .status {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    background: ${props => props.isSuccess ? props.theme.colors.success : props.isError ? props.theme.colors.danger : props.theme.colors.warning};
    color: white;
  }

  .image-container {
    aspect-ratio: 1;
    background: repeating-conic-gradient(#808080 0% 25%, #666 0% 50%) 50% / 20px 20px;
    border: 1px solid ${props => props.theme.colors.border};
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
      image-rendering: pixelated;
    }
  }

  .prompt {
    font-size: 0.75rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .metadata {
    font-size: 0.7rem;
    color: ${props => props.theme.colors.primary};
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
`;

const VariationsList = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;

  h4 {
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.colors.primary};
    font-size: 0.9rem;
  }

  .variation-item {
    padding: 0.5rem;
    background: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    margin-bottom: 0.3rem;
    font-size: 0.8rem;
    border-radius: 2px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 24px;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;

  .progress-fill {
    height: 100%;
    background: ${props => props.theme.colors.primary};
    transition: width 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.background};
    font-size: 0.8rem;
    font-weight: bold;
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;

  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3rem;
    font-size: 0.85rem;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: ${props => props.theme.colors.textSecondary};
    }

    .value {
      color: ${props => props.theme.colors.primary};
      font-weight: bold;
    }
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const TemplateButton = styled(RetroButton)`
  font-size: 0.8rem;
  padding: 0.5rem;
`;

const BatchGenerator = () => {
  const { user } = useUser();
  const [basePrompt, setBasePrompt] = useState('');
  const [batchCount, setBatchCount] = useState(4);
  const [variationType, setVariationType] = useState('color');
  const [customVariations, setCustomVariations] = useState('');
  const [results, setResults] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState(64);

  const variationTypes = {
    color: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
    style: ['cute', 'scary', 'realistic', 'cartoon', 'minimalist', 'detailed'],
    mood: ['happy', 'angry', 'sad', 'excited', 'peaceful', 'mysterious'],
    time: ['day', 'night', 'sunset', 'dawn', 'twilight', 'midday'],
    season: ['spring', 'summer', 'autumn', 'winter'],
    element: ['fire', 'water', 'earth', 'air', 'ice', 'lightning']
  };

  const templates = {
    character: {
      name: 'Character Variations',
      prompt: 'pixel art character sprite',
      variations: 'color'
    },
    weapon: {
      name: 'Weapon Set',
      prompt: 'pixel art weapon',
      variations: 'element'
    },
    environment: {
      name: 'Environment Pack',
      prompt: 'pixel art environment',
      variations: 'time'
    },
    enemy: {
      name: 'Enemy Variants',
      prompt: 'pixel art enemy monster',
      variations: 'color'
    }
  };

  const loadTemplate = (templateKey) => {
    const template = templates[templateKey];
    setBasePrompt(template.prompt);
    setVariationType(template.variations);
  };

  const generateBatch = async () => {
    if (!basePrompt.trim()) {
      alert('Please enter a base prompt');
      return;
    }

    if (!user) {
      alert('Please login to generate');
      return;
    }

    setIsGenerating(true);
    setResults([]);
    setProgress(0);

    try {
      // Get variations
      let variations = [];
      if (customVariations.trim()) {
        variations = customVariations.split(',').map(v => v.trim()).filter(v => v);
      } else {
        variations = variationTypes[variationType]?.slice(0, batchCount) || [];
      }

      const totalCount = Math.min(variations.length, batchCount);
      const newResults = [];

      for (let i = 0; i < totalCount; i++) {
        const variation = variations[i];
        const prompt = `${basePrompt}, ${variation} variant`;

        // Placeholder result - in production, call actual API
        // const response = await api.post('/images/generate', {
        //   prompt,
        //   width: dimensions,
        //   height: dimensions,
        //   style: 'pixel-art'
        // });

        // Simulate generation
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = document.createElement('canvas');
        canvas.width = dimensions;
        canvas.height = dimensions;
        const ctx = canvas.getContext('2d');

        // Create placeholder
        const hue = (i * 360 / totalCount);
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(0, 0, dimensions, dimensions);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(0, 0, dimensions, dimensions);
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(variation, dimensions / 2, dimensions / 2);

        newResults.push({
          id: Date.now() + i,
          prompt,
          variation,
          imageUrl: canvas.toDataURL(),
          width: dimensions,
          height: dimensions,
          isSuccess: true,
          isError: false
        });

        setResults([...newResults]);
        setProgress(((i + 1) / totalCount) * 100);
      }

    } catch (error) {
      console.error('Batch generation error:', error);
      alert('Error during batch generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAll = () => {
    results.forEach((result, index) => {
      const link = document.createElement('a');
      link.download = `batch-${index + 1}-${result.variation}.png`;
      link.href = result.imageUrl;
      link.click();
    });
  };

  const downloadAsZip = () => {
    alert('ZIP download would require JSZip library. For now, use Download All to get individual files.');
  };

  const exportMetadata = () => {
    const metadata = {
      batch: {
        basePrompt,
        variationType,
        count: results.length,
        dimensions: `${dimensions}x${dimensions}`,
        generated: new Date().toISOString(),
        results: results.map((r, i) => ({
          index: i,
          prompt: r.prompt,
          variation: r.variation,
          filename: `batch-${i + 1}-${r.variation}.png`
        }))
      }
    };

    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'batch-metadata.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const estimatedCredits = Math.min(batchCount, customVariations.split(',').filter(v => v.trim()).length || variationTypes[variationType]?.length || 0) * 5;

  return (
    <Container>
      <Header>
        <h1>🚀 Batch Generator</h1>
        <p>Generate multiple variations of your assets in one go - massive time saver!</p>
      </Header>

      <Grid>
        <ControlsSection>
          <ControlGroup>
            <label>Quick Templates</label>
            <TemplateGrid>
              {Object.entries(templates).map(([key, template]) => (
                <TemplateButton
                  key={key}
                  onClick={() => loadTemplate(key)}
                  variant="secondary"
                >
                  {template.name}
                </TemplateButton>
              ))}
            </TemplateGrid>
          </ControlGroup>

          <ControlGroup>
            <label>Base Prompt</label>
            <RetroInput
              as="textarea"
              rows={3}
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              placeholder="e.g., pixel art sword weapon"
            />
          </ControlGroup>

          <ControlGroup>
            <label>Variation Type</label>
            <RetroSelect value={variationType} onChange={(e) => setVariationType(e.target.value)}>
              {Object.keys(variationTypes).map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Variations
                </option>
              ))}
            </RetroSelect>
          </ControlGroup>

          <ControlGroup>
            <label>Custom Variations (comma-separated, optional)</label>
            <RetroInput
              as="textarea"
              rows={2}
              value={customVariations}
              onChange={(e) => setCustomVariations(e.target.value)}
              placeholder="e.g., red, blue, green, purple"
            />
          </ControlGroup>

          <ControlGroup>
            <label>Batch Size: {batchCount}</label>
            <RetroSlider
              min={2}
              max={20}
              value={batchCount}
              onChange={(value) => setBatchCount(value)}
            />
          </ControlGroup>

          <ControlGroup>
            <label>Dimensions</label>
            <RetroSelect value={dimensions} onChange={(e) => setDimensions(parseInt(e.target.value))}>
              <option value="32">32x32</option>
              <option value="64">64x64</option>
              <option value="128">128x128</option>
              <option value="256">256x256</option>
            </RetroSelect>
          </ControlGroup>

          <ControlGroup>
            <InfoBox>
              <div className="info-row">
                <span className="label">Estimated Credits:</span>
                <span className="value">{estimatedCredits}</span>
              </div>
              <div className="info-row">
                <span className="label">Your Credits:</span>
                <span className="value">{user?.credits || 0}</span>
              </div>
              <div className="info-row">
                <span className="label">After Generation:</span>
                <span className="value">{Math.max(0, (user?.credits || 0) - estimatedCredits)}</span>
              </div>
            </InfoBox>
          </ControlGroup>

          <ControlGroup>
            <RetroButton
              onClick={generateBatch}
              disabled={isGenerating || !basePrompt.trim()}
            >
              <FaRocket /> {isGenerating ? 'Generating...' : 'Generate Batch'}
            </RetroButton>
          </ControlGroup>

          {customVariations.trim() === '' && (
            <VariationsList>
              <h4>Preview Variations:</h4>
              {variationTypes[variationType]?.slice(0, batchCount).map((v, i) => (
                <div key={i} className="variation-item">
                  {i + 1}. {basePrompt}, {v} variant
                </div>
              ))}
            </VariationsList>
          )}
        </ControlsSection>

        <ResultsSection>
          <h3>Results ({results.length})</h3>

          {isGenerating && (
            <ProgressBar>
              <div className="progress-fill" style={{ width: `${progress}%` }}>
                {Math.round(progress)}%
              </div>
            </ProgressBar>
          )}

          {results.length > 0 && !isGenerating && (
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <RetroButton onClick={downloadAll}>
                <FaDownload /> Download All
              </RetroButton>
              <RetroButton onClick={exportMetadata} variant="secondary">
                <FaDownload /> Metadata
              </RetroButton>
            </div>
          )}

          <ResultsGrid>
            {results.map(result => (
              <ResultItem key={result.id} isSuccess={result.isSuccess} isError={result.isError}>
                <div className="status">
                  {result.isSuccess ? <FaCheck /> : result.isError ? <FaTimes /> : '...'}
                </div>
                <div className="image-container">
                  <img src={result.imageUrl} alt={result.variation} />
                </div>
                <div className="prompt">{result.prompt}</div>
                <div className="metadata">
                  <span>{result.width}x{result.height}</span>
                  <span>{result.variation}</span>
                </div>
              </ResultItem>
            ))}
          </ResultsGrid>
        </ResultsSection>
      </Grid>
    </Container>
  );
};

export default BatchGenerator;
