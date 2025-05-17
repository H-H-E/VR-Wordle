/**
 * Background button component
 * Toggles between environment themes when clicked
 */
AFRAME.registerComponent('backgroundButt', {
  schema: {
    // Array of theme names to cycle through
    themes: {
      type: 'array',
      default: ['night', 'starry']
    }
  },
  
  init() {
    // Keep track of current theme index
    this.currentThemeIndex = 0;
    
    // Apply the night theme on init to ensure proper settings
    setTimeout(() => {
      if (typeof themeSwitch === 'function') {
        themeSwitch('night');
      }
    }, 500);
    
    // Add click event listener
    this.el.addEventListener('click', this.handleClick.bind(this));
  },
  
  handleClick() {
    try {
      // Get next theme in rotation
      const nextTheme = this.data.themes[this.currentThemeIndex];
      
      // Call themeSwitch from gui.js
      if (typeof themeSwitch === 'function') {
        themeSwitch(nextTheme);
        
        // Update index for next click
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.data.themes.length;
        console.log(`Ready to switch to: ${this.data.themes[this.currentThemeIndex]} next time`);
      } else {
        console.error('themeSwitch function not found. Make sure gui.js is loaded before this component.');
      }
    } catch (error) {
      console.error('Error in backgroundButt click handler:', error);
    }
  }
}); 