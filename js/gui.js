/**
 * Theme switching utility for VRdle
 * Allows changing environment presets and associated lighting
 */

// Available themes
const THEMES = {
  night: {
    preset: 'night',
    skyType: 'gradient',
    skyColor: '#0d0d1a',
    horizonColor: '#191970',
    fog: 0.8,
    flatShading: false,
    ground: 'flat',
    groundTexture: 'none',
    groundColor: '#0a0a0a',
    groundColor2: '#0a0a14',
    grid: 'none',
    shadow: true,
    playArea: 1.5,
    lighting: 'point',
    lightPosition: '0 2.5 -0.5'
  },
  starry: {
    preset: 'starry',
    lighting: 'point',
    lightPosition: '0 2.5 -0.5',
    ambientColor: '#b9d5ff',
    directionalColor: '#ffffff',
    lightIntensity: 1.5,
    shadow: true
  },
  egypt: {
    preset: 'egypt',
    lighting: 'point',
    lightPosition: '0 2.5 -0.5',
    ambientColor: '#fff2cc',
    directionalColor: '#ffffe0',
    lightIntensity: 1.5,
    shadow: true
  },
  forest: {
    preset: 'forest',
    lighting: 'point',
    lightPosition: '0 2.5 -0.5',
    ambientColor: '#c9e6ca',
    directionalColor: '#f5faf5',
    lightIntensity: 1.5,
    shadow: true
  },
  dream: {
    preset: 'dream',
    lighting: 'point',
    lightPosition: '0 2.5 -0.5',
    ambientColor: '#e7d8f5',
    directionalColor: '#ffffff',
    lightIntensity: 1.5,
    shadow: true
  },
  volcano: {
    preset: 'volcano',
    lighting: 'point',
    lightPosition: '0 2.5 -0.5',
    ambientColor: '#ff8c7a',
    directionalColor: '#ffccaa',
    lightIntensity: 1.7,
    shadow: true
  }
};

/**
 * Switch to a specified theme or cycle to next theme if none specified
 * @param {string} themeName - Optional theme name to switch to
 * @returns {string} The name of the active theme after switching
 */
// Define but don't export to global scope to prevent conflicts
const _themeSwitch = (themeName) => {
  const environment = document.querySelector('[environment]');
  if (!environment) {
    console.error('No environment entity found');
    return null;
  }
  
  // Get current theme
  const currentPreset = environment.getAttribute('environment').preset;
  
  // Determine next theme
  let nextTheme;
  if (themeName && THEMES[themeName]) {
    nextTheme = themeName;
  } else {
    // Cycle to next theme
    const themeNames = Object.keys(THEMES);
    const currentIndex = themeNames.indexOf(currentPreset);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    nextTheme = themeNames[nextIndex];
  }
  
  // Apply theme
  try {
    const theme = THEMES[nextTheme];
    // Create attribute string from theme object
    const themeString = Object.entries(theme)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
      
    // Apply environment settings all at once
    environment.setAttribute('environment', themeString);
    
    // Update lights based on theme
    const ambientLight = document.querySelector('#ambient-light');
    const directionalLight = document.querySelector('#main-directional-light');
    
    if (nextTheme === 'night') {
      // Special handling for night theme
      if (ambientLight) {
        ambientLight.setAttribute('light', 'color: #0a1025; intensity: 0.25');
      }
      if (directionalLight) {
        directionalLight.setAttribute('light', 'color: #2c4073; intensity: 0.5; castShadow: true');
      }
    } else if (nextTheme === 'starry') {
      if (ambientLight) {
        ambientLight.setAttribute('light', 'color: #b9d5ff; intensity: 0.5');
      }
      if (directionalLight) {
        directionalLight.setAttribute('light', 'color: #ffffff; intensity: 0.8; castShadow: true');
      }
    } else {
      // Default light settings for other themes
      if (ambientLight) {
        ambientLight.setAttribute('light', `color: ${theme.horizonColor || '#fff'}; intensity: 0.5`);
      }
      if (directionalLight) {
        directionalLight.setAttribute('light', `color: ${theme.directionalColor || '#fff'}; intensity: 0.8; castShadow: true`);
      }
    }
    
    console.log(`Theme switched to: ${nextTheme}`);
    return nextTheme;
  } catch (error) {
    console.error('Error switching theme:', error);
    return currentPreset;
  }
};

// Export for module use if needed
if (typeof module !== 'undefined') {
  module.exports = { themeSwitch: _themeSwitch, THEMES };
}