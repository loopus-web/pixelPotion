import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaGrid3x3, FaFilm, FaMapMarked, FaPalette, FaRocket, FaBoxes } from 'react-icons/fa';
import RetroButton from '../components/ui/RetroButton';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  p {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ToolCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.theme.colors.primary};
    transform: scaleX(0);
    transition: transform 0.3s;
  }

  &:hover:after {
    transform: scaleX(1);
  }
`;

const ToolIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  text-align: center;
`;

const ToolTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const ToolDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ToolFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;

  li {
    color: ${props => props.theme.colors.text};
    padding: 0.3rem 0;
    font-size: 0.9rem;

    &:before {
      content: '▸ ';
      color: ${props => props.theme.colors.primary};
      font-weight: bold;
    }
  }
`;

const ToolBadge = styled.span`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ProBadge = styled(ToolBadge)`
  background: linear-gradient(45deg, #FF6B6B, #FFD93D);
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const ToolsPage = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'spritesheet',
      icon: <FaGrid3x3 />,
      title: 'Sprite Sheet Generator',
      description: 'Combine multiple sprites into optimized sprite sheets',
      features: [
        'Auto-grid layout with customizable spacing',
        'Export metadata (JSON, XML, CSS)',
        'Support for all game engines',
        'Batch processing'
      ],
      badge: 'Free',
      path: '/tools/spritesheet'
    },
    {
      id: 'animation',
      icon: <FaFilm />,
      title: 'Animation Creator',
      description: 'Create frame-by-frame sprite animations',
      features: [
        'Animation templates (walk, idle, attack)',
        'FPS control and playback preview',
        'Export as sprite sheet or GIF',
        'Frame duplication and editing'
      ],
      badge: 'Free',
      path: '/tools/animation'
    },
    {
      id: 'tileset',
      icon: <FaMapMarked />,
      title: 'Tileset Generator',
      description: 'Generate complete, cohesive tilesets for level design',
      features: [
        'Platform, terrain, dungeon templates',
        'Auto-tiling support',
        'Export for Godot, Unity, Tiled',
        'Themed generation (grass, desert, ice)'
      ],
      badge: 'Pro',
      isPro: true,
      path: '/tools/tileset'
    },
    {
      id: 'palette',
      icon: <FaPalette />,
      title: 'Color Palette Manager',
      description: 'Professional color palette creation and management',
      features: [
        'Classic palette presets (Game Boy, NES, PICO-8)',
        'Color harmony generation',
        'Export to multiple formats',
        'Save and organize palettes'
      ],
      badge: 'Free',
      path: '/tools/palette'
    },
    {
      id: 'batch',
      icon: <FaRocket />,
      title: 'Batch Generator',
      description: 'Generate multiple asset variations at once',
      features: [
        'Color, style, and mood variations',
        'Templates for common use cases',
        'Bulk download and export',
        'Massive time saver'
      ],
      badge: 'Pro',
      isPro: true,
      path: '/tools/batch'
    },
    {
      id: 'packs',
      icon: <FaBoxes />,
      title: 'Asset Packs',
      description: 'Pre-made, cohesive asset collections',
      features: [
        'Character packs with animations',
        'Complete UI kits',
        'Environment tile sets',
        'Commercially licensed'
      ],
      badge: 'Premium',
      isPro: true,
      path: '/asset-packs'
    }
  ];

  const handleToolClick = (path, isPro) => {
    // In a real app, check if user has access
    navigate(path);
  };

  return (
    <Container>
      <Header>
        <h1>🛠️ Professional Tools</h1>
        <p>
          Powerful tools designed to make game and web development faster and easier.
          <br />
          Everything you need to create professional pixel art assets.
        </p>
      </Header>

      <ToolsGrid>
        {tools.map(tool => (
          <ToolCard key={tool.id} onClick={() => handleToolClick(tool.path, tool.isPro)}>
            {tool.isPro ? (
              <ProBadge>{tool.badge}</ProBadge>
            ) : (
              <ToolBadge>{tool.badge}</ToolBadge>
            )}

            <ToolIcon>{tool.icon}</ToolIcon>
            <ToolTitle>{tool.title}</ToolTitle>
            <ToolDescription>{tool.description}</ToolDescription>

            <ToolFeatures>
              {tool.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ToolFeatures>

            <ButtonContainer>
              <RetroButton variant={tool.isPro ? 'primary' : 'secondary'}>
                {tool.isPro ? 'Upgrade to Access' : 'Use Tool'}
              </RetroButton>
            </ButtonContainer>
          </ToolCard>
        ))}
      </ToolsGrid>
    </Container>
  );
};

export default ToolsPage;
