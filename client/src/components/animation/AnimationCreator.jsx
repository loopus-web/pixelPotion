import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaPlus, FaDownload, FaTrash, FaCopy } from 'react-icons/fa';
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
  grid-template-columns: 1fr 350px;
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

const AnimationCanvas = styled.canvas`
  width: 100%;
  max-width: 400px;
  height: 400px;
  background: repeating-conic-gradient(#808080 0% 25%, #666 0% 50%) 50% / 20px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  image-rendering: pixelated;
  margin: 0 auto;
  display: block;
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
`;

const PlaybackControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FrameTimeline = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h4 {
    margin: 0;
    color: ${props => props.theme.colors.primary};
  }
`;

const FrameList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const FrameItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: repeating-conic-gradient(#808080 0% 25%, #666 0% 50%) 50% / 10px 10px;
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
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

  .frame-number {
    position: absolute;
    top: 2px;
    left: 2px;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
    font-size: 0.7rem;
    padding: 2px 4px;
    border-radius: 2px;
  }

  .frame-actions {
    position: absolute;
    top: 2px;
    right: 2px;
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .frame-actions {
    opacity: 1;
  }

  button {
    background: ${props => props.theme.colors.danger};
    border: none;
    color: white;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.6rem;
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TemplateButton = styled(RetroButton)`
  font-size: 0.8rem;
  padding: 0.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const ExportButtons = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AnimationInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};

  div {
    margin-bottom: 0.3rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const AnimationCreator = () => {
  const [frames, setFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(12);
  const [loop, setLoop] = useState(true);
  const [animationType, setAnimationType] = useState('custom');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const animationRef = useRef(null);

  // Animation templates
  const templates = {
    walk: { frames: 8, description: 'Walking cycle (8 frames)' },
    idle: { frames: 4, description: 'Idle breathing (4 frames)' },
    attack: { frames: 6, description: 'Attack animation (6 frames)' },
    jump: { frames: 6, description: 'Jump cycle (6 frames)' },
    run: { frames: 8, description: 'Running cycle (8 frames)' },
    hit: { frames: 3, description: 'Hit reaction (3 frames)' }
  };

  useEffect(() => {
    if (frames.length > 0) {
      drawFrame(currentFrame);
    }
  }, [currentFrame, frames]);

  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      const interval = 1000 / fps;
      animationRef.current = setInterval(() => {
        setCurrentFrame(prev => {
          const next = prev + 1;
          if (next >= frames.length) {
            if (loop) {
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return next;
        });
      }, interval);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, fps, frames.length, loop]);

  const drawFrame = (frameIndex) => {
    if (!canvasRef.current || !frames[frameIndex]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const frame = frames[frameIndex];

    canvas.width = 256;
    canvas.height = 256;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (frame.image) {
      const scale = Math.min(canvas.width / frame.image.width, canvas.height / frame.image.height);
      const x = (canvas.width - frame.image.width * scale) / 2;
      const y = (canvas.height - frame.image.height * scale) / 2;
      ctx.drawImage(frame.image, x, y, frame.image.width * scale, frame.image.height * scale);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setFrames(prev => [...prev, {
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

  const removeFrame = (index) => {
    setFrames(prev => prev.filter((_, i) => i !== index));
    if (currentFrame >= frames.length - 1) {
      setCurrentFrame(Math.max(0, frames.length - 2));
    }
  };

  const duplicateFrame = (index) => {
    const frame = frames[index];
    setFrames(prev => [
      ...prev.slice(0, index + 1),
      { ...frame, id: Date.now() + Math.random() },
      ...prev.slice(index + 1)
    ]);
  };

  const loadTemplate = (templateName) => {
    const template = templates[templateName];
    setAnimationType(templateName);
    // In a real app, this would generate frames based on AI with the template
    alert(`Template "${templateName}" selected. Upload ${template.frames} frames or generate them using the AI generator.`);
  };

  const exportAsGIF = async () => {
    if (frames.length === 0) return;

    // Note: In a real app, you'd use a library like gif.js
    alert('GIF export would use gif.js library. Implementation requires adding the dependency.');
  };

  const exportAsSpriteSheet = () => {
    if (frames.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const frameWidth = frames[0].image.width;
    const frameHeight = frames[0].image.height;

    canvas.width = frameWidth * frames.length;
    canvas.height = frameHeight;

    frames.forEach((frame, i) => {
      ctx.drawImage(frame.image, i * frameWidth, 0, frameWidth, frameHeight);
    });

    const link = document.createElement('a');
    link.download = `animation-spritesheet.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportMetadata = () => {
    if (frames.length === 0) return;

    const metadata = {
      animation: {
        name: animationType,
        frameCount: frames.length,
        fps: fps,
        duration: (frames.length / fps) * 1000,
        loop: loop,
        frames: frames.map((frame, i) => ({
          index: i,
          name: frame.name,
          duration: 1000 / fps
        }))
      }
    };

    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'animation-metadata.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <Container>
      <Header>
        <h1>🎬 Animation Creator</h1>
        <p>Create professional sprite animations for your games with frame-by-frame control</p>
      </Header>

      <Grid>
        <PreviewSection>
          <h3>Animation Preview</h3>
          <AnimationCanvas ref={canvasRef} />

          <PlaybackControls>
            <RetroButton onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? ' Pause' : ' Play'}
            </RetroButton>
            <RetroButton onClick={() => setCurrentFrame(0)} variant="secondary">
              Reset
            </RetroButton>
          </PlaybackControls>

          <AnimationInfo>
            <div><strong>Frame:</strong> {currentFrame + 1} / {frames.length}</div>
            <div><strong>FPS:</strong> {fps}</div>
            <div><strong>Duration:</strong> {frames.length > 0 ? ((frames.length / fps) * 1000).toFixed(0) : 0}ms</div>
            <div><strong>Loop:</strong> {loop ? 'Yes' : 'No'}</div>
          </AnimationInfo>

          <FrameTimeline>
            <TimelineHeader>
              <h4>Timeline ({frames.length} frames)</h4>
              <RetroButton size="small" onClick={() => fileInputRef.current?.click()}>
                <FaPlus /> Add Frames
              </RetroButton>
            </TimelineHeader>

            <FileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
            />

            <FrameList>
              {frames.map((frame, index) => (
                <FrameItem
                  key={frame.id}
                  isActive={index === currentFrame}
                  onClick={() => setCurrentFrame(index)}
                >
                  <div className="frame-number">{index + 1}</div>
                  <img src={frame.url} alt={`Frame ${index + 1}`} />
                  <div className="frame-actions">
                    <button onClick={(e) => { e.stopPropagation(); duplicateFrame(index); }} title="Duplicate">
                      <FaCopy />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); removeFrame(index); }} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </FrameItem>
              ))}
            </FrameList>
          </FrameTimeline>
        </PreviewSection>

        <ControlsSection>
          <ControlGroup>
            <label>Animation Templates</label>
            <TemplateGrid>
              {Object.entries(templates).map(([key, template]) => (
                <TemplateButton
                  key={key}
                  onClick={() => loadTemplate(key)}
                  variant={animationType === key ? 'primary' : 'secondary'}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </TemplateButton>
              ))}
            </TemplateGrid>
          </ControlGroup>

          <ControlGroup>
            <label>Frames Per Second: {fps}</label>
            <RetroSlider
              min={1}
              max={60}
              value={fps}
              onChange={(value) => setFps(value)}
            />
          </ControlGroup>

          <ControlGroup>
            <label>Loop Animation</label>
            <RetroSelect value={loop ? 'true' : 'false'} onChange={(e) => setLoop(e.target.value === 'true')}>
              <option value="true">Yes</option>
              <option value="false">No (Play Once)</option>
            </RetroSelect>
          </ControlGroup>

          <ControlGroup>
            <label>Export Options</label>
            <ExportButtons>
              <RetroButton onClick={exportAsSpriteSheet} disabled={frames.length === 0}>
                <FaDownload /> Sprite Sheet
              </RetroButton>
              <RetroButton onClick={exportAsGIF} disabled={frames.length === 0} variant="secondary">
                <FaDownload /> GIF Animation
              </RetroButton>
              <RetroButton onClick={exportMetadata} disabled={frames.length === 0} variant="secondary">
                <FaDownload /> Metadata JSON
              </RetroButton>
            </ExportButtons>
          </ControlGroup>
        </ControlsSection>
      </Grid>
    </Container>
  );
};

export default AnimationCreator;
