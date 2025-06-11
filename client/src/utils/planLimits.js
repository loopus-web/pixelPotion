/**
 * Plan Limits Configuration
 * 
 * This utility defines all feature limitations based on subscription plans.
 * Used throughout the application to enforce plan-specific limitations.
 */

// Maximum resolution by plan
const MAX_RESOLUTION = {
  free: { width: 256, height: 256 },
  pro: { width: 512, height: 512 },
  ultimate: { width: 512, height: 512 }
};

// Available pixel art styles by plan
const AVAILABLE_STYLES = {
  free: ['simple', 'retro'],
  pro: ['8-bit', '16-bit', 'gameboy', 'commodore64', 'pixel', 'pixelart', 'simple', 'detailed', 'retro', 'anime', 'no_style'],
  ultimate: ['8-bit', '16-bit', 'gameboy', 'commodore64', 'pixel', 'pixelart', 'exclusive1', 'exclusive2', 'exclusive3', 'custom', 'simple', 'detailed', 'retro', 'anime', 'no_style']
};

// Maximum number of images in gallery by plan
const MAX_GALLERY_IMAGES = {
  free: 50,
  pro: 1000,
  ultimate: 5000
};

// Available export formats by plan
const EXPORT_FORMATS = {
  free: ['png'],
  pro: ['png', 'gif'],
  ultimate: ['png', 'gif', 'svg']
};

// Batch processing availability
const BATCH_PROCESSING = {
  free: false,
  pro: false,
  ultimate: true
};

// Maximum number of generated images per batch
const MAX_IMAGES_PER_GENERATION = {
  free: 5,
  pro: 10,
  ultimate: 20
};

/**
 * Get max resolution based on user plan
 * @param {string} plan - User's subscription plan
 * @returns {Object} Maximum width and height
 */
export const getMaxResolution = (plan = 'free') => {
  return MAX_RESOLUTION[plan] || MAX_RESOLUTION.free;
};

/**
 * Check if a resolution is allowed for a user's plan
 * @param {string} plan - User's subscription plan
 * @param {number} width - Requested width
 * @param {number} height - Requested height
 * @returns {boolean} Whether the resolution is allowed
 */
export const isResolutionAllowed = (plan = 'free', width, height) => {
  const maxRes = getMaxResolution(plan);
  return width <= maxRes.width && height <= maxRes.height;
};

/**
 * Get all available styles for a user's plan
 * @param {string} plan - User's subscription plan
 * @returns {Array} List of available styles
 */
export const getAvailableStyles = (plan = 'free') => {
  return AVAILABLE_STYLES[plan] || AVAILABLE_STYLES.free;
};

/**
 * Check if a style is available for a user's plan
 * @param {string} plan - User's subscription plan
 * @param {string} style - Style to check
 * @returns {boolean} Whether the style is available
 */
export const isStyleAvailable = (plan = 'free', style) => {
  return getAvailableStyles(plan).includes(style);
};

/**
 * Get maximum gallery storage for a user's plan
 * @param {string} plan - User's subscription plan
 * @returns {number} Maximum number of images
 */
export const getMaxGalleryImages = (plan = 'free') => {
  return MAX_GALLERY_IMAGES[plan] || MAX_GALLERY_IMAGES.free;
};

/**
 * Check if user can store more images in gallery
 * @param {string} plan - User's subscription plan
 * @param {number} currentCount - Current number of images in gallery
 * @returns {boolean} Whether more images can be stored
 */
export const canStoreMoreImages = (plan = 'free', currentCount) => {
  return currentCount < getMaxGalleryImages(plan);
};

/**
 * Get available export formats for a user's plan
 * @param {string} plan - User's subscription plan
 * @returns {Array} List of available export formats
 */
export const getExportFormats = (plan = 'free') => {
  return EXPORT_FORMATS[plan] || EXPORT_FORMATS.free;
};

/**
 * Check if an export format is available for a user's plan
 * @param {string} plan - User's subscription plan
 * @param {string} format - Format to check
 * @returns {boolean} Whether the format is available
 */
export const isExportFormatAvailable = (plan = 'free', format) => {
  return getExportFormats(plan).includes(format.toLowerCase());
};

/**
 * Check if batch processing is available for a user's plan
 * @param {string} plan - User's subscription plan
 * @returns {boolean} Whether batch processing is available
 */
export const isBatchProcessingAvailable = (plan = 'free') => {
  return BATCH_PROCESSING[plan] || false;
};

/**
 * Get maximum images per generation for a user's plan
 * @param {string} plan - User's subscription plan
 * @returns {number} Maximum number of images per generation
 */
export const getMaxImagesPerGeneration = (plan = 'free') => {
  return MAX_IMAGES_PER_GENERATION[plan] || MAX_IMAGES_PER_GENERATION.free;
};

/**
 * Get plan requirements text for a feature
 * @param {string} feature - Feature name ('resolution', 'styles', 'gallery', 'export', 'batch')
 * @returns {string} Information about plan requirements
 */
export const getPlanRequirementText = (feature) => {
  switch (feature) {
    case 'resolution':
      return 'Upgrade to Pro or Ultimate plan for resolutions up to 512x512';
    case 'styles':
      return 'Upgrade to Pro plan for all styles or Ultimate plan for exclusive styles';
    case 'gallery':
      return 'Upgrade to Pro plan (1000 images) or Ultimate plan (5000 images) for more storage';
    case 'export':
      return 'Upgrade to Pro or Ultimate plan for additional export formats';
    case 'batch':
      return 'Upgrade to Ultimate plan for batch image generation';
    default:
      return 'Upgrade your plan to unlock this feature';
  }
};
