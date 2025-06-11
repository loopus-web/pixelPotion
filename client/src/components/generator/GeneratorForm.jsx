import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSoundContext } from '../../context/SoundContext';
import { useUserContext } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import RetroButton from '../ui/RetroButton';
import RetroInput from '../ui/RetroInput';
import RetroSelect from '../ui/RetroSelect';
import RetroToggle from '../ui/RetroToggle';
import RetroSlider from '../ui/RetroSlider';
import { toast } from 'react-toastify';

const dimensionPresets = [
  { label: 'Small Sprite (64x64)', value: '64x64', width: 64, height: 64 },
  { label: 'Medium Sprite (128x128)', value: '128x128', width: 128, height: 128 },
  { label: 'Large Sprite (256x256)', value: '256x256', width: 256, height: 256 },
  { label: 'Max Size (512x512)', value: '512x512', width: 512, height: 512 },
  { label: 'Custom', value: 'custom' }
];

const FormContainer = styled.div`
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.panel},
    ${({ theme }) => theme.colors.panelDark}
  );
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  position: relative;
  backdrop-filter: blur(10px);
  overflow: hidden;
  
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
  }
`;

const FormTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fonts.sizes.xxlarge};
  text-transform: uppercase;
  text-shadow: 0 0 12px ${({ theme }) => theme.colors.primary + '40'};
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  position: relative;
  text-align: center;
  justify-content: center;
  
  &:before, &:after {
    content: '>';
    margin: 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 80%;
    animation: blink 1.2s step-end infinite;
    text-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
  }
  
  &:after {
    content: '<';
  }
  
  @keyframes blink {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
  
  &:hover label {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  transition: color 0.2s ease;
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  position: relative;
  
  /* Subtle glow effect under the main button */
  &:after {
    content: '';
    position: absolute;
    width: 80%;
    height: 10px;
    bottom: -15px;
    left: 10%;
    background: radial-gradient(ellipse at center, 
      ${({ theme }) => theme.colors.primary + '30'} 0%, 
      transparent 70%);
    opacity: 0.6;
    filter: blur(5px);
  }
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-style: italic;
  opacity: 0.8;
`;

const PlanLimitInfo = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  color: ${({ theme }) => theme.colors.accent};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px dashed ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => theme.colors.accent}10;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const LockedFeature = styled.div`
  position: relative;
  opacity: 0.6;
  
  &:after {
    content: '🔒';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: ${({ theme }) => theme.colors.accent};
    z-index: 2;
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.background}40;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background}70;
    transform: translateY(-2px);
  }
`;

const ImagePreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ReferenceImagePreview = styled.img`
  max-width: 100%;
  max-height: 150px;
  object-fit: contain;
  margin-top: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.small};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const RemoveButton = styled.button`
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  margin-top: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fonts.sizes.xsmall};
  text-transform: uppercase;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.dangerDark || '#a00'};
    transform: scale(1.05);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const CreditCost = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, hasEnough }) => hasEnough ? theme.colors.secondary : theme.colors.error};
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  margin-top: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.panelDark};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  
  .icon {
    font-size: 16px;
  }
  
  .cost {
    font-weight: bold;
    color: ${({ theme, hasEnough }) => hasEnough ? theme.colors.bright.yellow : theme.colors.error};
  }
  
  .insufficient {
    color: ${({ theme }) => theme.colors.error};
    font-weight: bold;
  }
  
  .get-credits {
    color: ${({ theme }) => theme.colors.accent};
    margin-left: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: ${({ theme }) => theme.colors.bright.yellow};
    }
  }
`;

function GeneratorForm({ onGenerate, initialPrompt, requiresAuth, onAuthRequired }) {
  const { playSound } = useSoundContext();
  const { user } = useAuth();
  const { 
    user: userDetails, 
    deductCredits, 
    addGenerationToHistory, 
    getMaxResolution,
  } = useUserContext();
  const fileInputRef = useRef(null);
  
  const maxResolution = getMaxResolution();
  
  const [formData, setFormData] = useState({
    prompt: initialPrompt || '',
    width: 128,
    height: 128,
    seed: Math.floor(Math.random() * 1000000),
    referenceImage: null,
    referenceStrength: 0.7
  });
  
  const [selectedResolutionPreset, setSelectedResolutionPreset] = useState('128x128');
  const [customWidth, setCustomWidth] = useState(128);
  const [customHeight, setCustomHeight] = useState(128);
  
  useEffect(() => {
    if (initialPrompt) {
      setFormData(prev => ({
        ...prev,
        prompt: initialPrompt
      }));
    }
  }, [initialPrompt]);
  
  useEffect(() => {
    const planMaxWidth = maxResolution.width;
    const planMaxHeight = maxResolution.height;
    let newWidth = formData.width;
    let newHeight = formData.height;

    if (selectedResolutionPreset === 'custom') {
      newWidth = Math.min(Number(customWidth) || 128, planMaxWidth);
      newHeight = Math.min(Number(customHeight) || 128, planMaxHeight);
      
      if (Number(customWidth) > planMaxWidth || Number(customHeight) > planMaxHeight) {
         toast.info(`Custom dimensions capped at ${planMaxWidth}x${planMaxHeight} by your plan.`);
      }
    } else {
      const preset = dimensionPresets.find(p => p.value === selectedResolutionPreset);
      if (preset) {
        newWidth = Math.min(preset.width, planMaxWidth);
        newHeight = Math.min(preset.height, planMaxHeight);
        if (preset.width > planMaxWidth || preset.height > planMaxHeight) {
            toast.info(`Preset '${preset.label}' adjusted to ${newWidth}x${newHeight} to fit your plan's maximum.`);
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      width: newWidth,
      height: newHeight
    }));

  }, [selectedResolutionPreset, customWidth, customHeight, maxResolution, userDetails]);

  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seed' ? parseInt(value, 10) : value
    }));
  };
  
  const handleRandomSeed = () => {
    playSound('click');
    setFormData(prev => ({
      ...prev,
      seed: Math.floor(Math.random() * 1000000)
    }));
  };
  
  const handleImageUploadClick = () => {
    fileInputRef.current.click();
    playSound('click');
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 4MB');
      playSound('error');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      playSound('error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      
      const base64String = reader.result.split(',')[1];
      setFormData(prev => ({
        ...prev,
        referenceImage: base64String
      }));
      
      playSound('success');
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setFormData(prev => ({
      ...prev,
      referenceImage: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    playSound('click');
  };
  
  const handleReferenceStrengthChange = (value) => {
    setFormData(prev => ({
      ...prev,
      referenceStrength: value
    }));
    playSound('slider');
  };
  
  const handleResolutionPresetChange = (e) => {
    const { value } = e.target;
    setSelectedResolutionPreset(value);
    playSound('select');
    if (value === 'custom') {
      const currentPlanMaxWidth = maxResolution.width;
      const currentPlanMaxHeight = maxResolution.height;
      setCustomWidth(Math.min(formData.width || 128, currentPlanMaxWidth));
      setCustomHeight(Math.min(formData.height || 128, currentPlanMaxHeight));
    }
  };

  const handleCustomDimensionChange = (e) => {
    const { name, value } = e.target;
    let numValue = parseInt(value, 10);

    if (isNaN(numValue)) {
        numValue = 32;
    }
    
    const fieldCappedValue = Math.min(Math.max(numValue, 32), 512);

    if (name === 'customWidth') {
      setCustomWidth(fieldCappedValue);
    } else if (name === 'customHeight') {
      setCustomHeight(fieldCappedValue);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    playSound('submit');

    if (requiresAuth && !user) {
      if(onAuthRequired) onAuthRequired();
      return;
    }

    if (!formData.prompt.trim()) {
      toast.error('Please enter a prompt to describe your image.');
      playSound('error');
      return;
    }
    
    const generationCost = 5;
    if (userDetails && userDetails.credits < generationCost) {
        toast.error(
          <div>
            You don't have enough credits. Required: {generationCost}, Available: {userDetails.credits}.
            <span 
              className="get-credits" 
              onClick={handleGetMoreCredits} 
              style={{cursor: 'pointer', textDecoration: 'underline', marginLeft: '5px'}}
            >
              Get More
            </span>
          </div>
        );
        playSound('error');
        return;
    }

    setIsLoading(true);
    try {
      const payloadWidth = Number(formData.width);
      const payloadHeight = Number(formData.height);

      if (isNaN(payloadWidth) || isNaN(payloadHeight) || payloadWidth < 32 || payloadHeight < 32) {
        toast.error('Invalid dimensions. Minimum is 32x32.');
        setIsLoading(false);
        playSound('error');
        return;
      }
      
      const generationData = {
        prompt: formData.prompt,
        width: payloadWidth,
        height: payloadHeight,
        num_images: 1,
        seed: formData.seed,
        ...(formData.referenceImage && { 
            reference_image: formData.referenceImage,
            reference_strength: formData.referenceStrength
        })
      };
      
      const imageUrl = await onGenerate(generationData);

      if (user && userDetails) {
        deductCredits(generationCost);
        addGenerationToHistory({
          id: `gen_${Date.now()}`,
          url: imageUrl,
          prompt: formData.prompt,
          width: payloadWidth,
          height: payloadHeight,
          seed: formData.seed,
          createdAt: new Date().toISOString(),
          referenceImage: formData.referenceImage ? 'yes' : 'no'
        });
      }
      
      toast.success('Image generated successfully!');
      playSound('success');

    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error.message || 'Failed to generate image. Please try again.');
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetMoreCredits = () => {
    playSound('click');
    toast.info("Redirecting to get more credits...");
  };
  
  return (
    <FormContainer>
      <FormTitle>Pixel Art Creator</FormTitle>
      
      <FormGrid onSubmit={handleSubmit}>
        <div>
          <FormField>
            <FormLabel>What do you want to generate?</FormLabel>
            <RetroInput
              type="text"
              placeholder="Describe your pixel art in detail..."
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              style={{ fontSize: '1rem', padding: '12px' }}
            />
            <InfoText>
              Be descriptive for better results. Use keywords like "pixel art", "top-down view", etc.
            </InfoText>
          </FormField>
          
          <FormField>
            <FormLabel>Image Resolution</FormLabel>
            <RetroSelect
              name="resolutionPreset"
              value={selectedResolutionPreset}
              onChange={handleResolutionPresetChange}
            >
              {dimensionPresets.map(preset => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </RetroSelect>

            {selectedResolutionPreset === 'custom' && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <div style={{ flex: 1 }}>
                  <RetroInput
                    type="number"
                    min="32"
                    max="512"
                    name="customWidth"
                    value={customWidth}
                    onChange={handleCustomDimensionChange}
                    placeholder="Width"
                  />
                </div>
                <div>×</div>
                <div style={{ flex: 1 }}>
                  <RetroInput
                    type="number"
                    min="32"
                    max="512"
                    name="customHeight"
                    value={customHeight}
                    onChange={handleCustomDimensionChange}
                    placeholder="Height"
                  />
                </div>
              </div>
            )}
            {userDetails && (
              <PlanLimitInfo>
                Max resolution for {userDetails?.plan || 'free'} plan: {maxResolution.width}x{maxResolution.height}
              </PlanLimitInfo>
            )}
          </FormField>
          
          <FormField>
            <FormLabel>Seed (for reproducibility)</FormLabel>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <RetroInput
                  type="number"
                  name="seed"
                  value={formData.seed}
                  onChange={handleChange}
                />
              </div>
              <RetroButton type="button" onClick={handleRandomSeed} size="small">
                Random
              </RetroButton>
            </div>
            <InfoText>
              Same seed + prompt will generate similar images. Change for variations.
            </InfoText>
          </FormField>
        </div>
        
        <div>
          <FormField>
            <FormLabel>Reference Image (Optional)</FormLabel>
            {!previewUrl ? (
              <ImageUploadContainer onClick={handleImageUploadClick}>
                <div>📷 Click to upload a reference</div>
                <InfoText>Max 4MB - JPG, PNG</InfoText>
                <HiddenInput
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </ImageUploadContainer>
            ) : (
              <ImagePreviewContainer>
                <ReferenceImagePreview src={previewUrl} alt="Reference" />
                <RemoveButton onClick={handleRemoveImage}>
                  Remove
                </RemoveButton>
                <FormField>
                  <FormLabel>Reference Strength: {formData.referenceStrength.toFixed(1)}</FormLabel>
                  <RetroSlider
                    min={0.1}
                    max={0.9}
                    step={0.1}
                    value={formData.referenceStrength}
                    onChange={handleReferenceStrengthChange}
                  />
                </FormField>
              </ImagePreviewContainer>
            )}
          </FormField>
        </div>
        
        <ButtonContainer>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <RetroButton
              type="submit"
              color="primary"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? 'GENERATING...' : 'GENERATE PIXEL ART'}
            </RetroButton>
            
            {userDetails && (
              <CreditCost hasEnough={userDetails?.credits >= 5}>
                <span className="icon">💎</span>
                <span>Cost: <span className="cost">5</span> credits</span>
                {userDetails?.credits < 5 && (
                  <>
                    <span className="insufficient">(Insufficient)</span>
                    <span 
                      className="get-credits" 
                      onClick={handleGetMoreCredits}
                    >
                      Get More
                    </span>
                  </>
                )}
              </CreditCost>
            )}
          </div>
        </ButtonContainer>
      </FormGrid>
    </FormContainer>
  );
}

export default GeneratorForm;