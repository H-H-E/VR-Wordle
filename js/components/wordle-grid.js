/**
 * Wordle grid generator component
 * Dynamically creates the game grid
 */
AFRAME.registerComponent('wordle-grid', {
  schema: {
    // Number of rows in the grid
    rows: { type: 'number', default: 6 },
    
    // Number of columns in the grid
    cols: { type: 'number', default: 5 },
    
    // Whether to use high-performance text (if troika-text is available)
    useHighPerfText: { type: 'boolean', default: false }
  },
  
  init() {
    // Wait until the scene is loaded before generating the grid
    if (this.el.sceneEl.hasLoaded) {
      this.generateGrid();
    } else {
      this.el.sceneEl.addEventListener('loaded', this.generateGrid.bind(this));
    }
  },
  
  /**
   * Generate the Wordle grid
   */
  generateGrid() {
    try {
      const { rows, cols, useHighPerfText } = this.data;
      const wordGrid = this.el;
      
      // Clear any existing children if regenerating
      while (wordGrid.firstChild) {
        wordGrid.removeChild(wordGrid.firstChild);
      }
      
      // Adjust layout variables for a cleaner board
      const cellSpacing = 0.34;   // Horizontal spacing between tiles
      const rowSpacing  = 0.38;   // Vertical spacing between rows
      const tileSize    = 0.32;   // Width/height of each tile background
      
      // Offset grid so it is centered
      const gridWidth  = (cols - 1) * cellSpacing;
      const gridHeight = (rows - 1) * rowSpacing;
      
      // Create each row
      for (let i = 0; i < rows; i++) {
        const rowEntity = document.createElement('a-entity');
        rowEntity.id = `row${i + 1}`;
        rowEntity.setAttribute('position', `${-gridWidth / 2} ${gridHeight / 2 - i * rowSpacing} 0`);
        
        // Create letter cells in each row
        for (let j = 0; j < cols; j++) {
          // Character display entity (direct child for words.js compatibility)
          const charDisplay = document.createElement('a-entity');
          charDisplay.classList.add('charDisplay');
          charDisplay.setAttribute('position', `${j * cellSpacing} 0 0`);
          charDisplay.setAttribute('rotation', '0 0 0');
          charDisplay.setAttribute('scale', '1 1 1');

          // Background plane as child of charDisplay
          const bg = document.createElement('a-entity');
          bg.setAttribute('geometry', `primitive: plane; width: ${tileSize}; height: ${tileSize}`);
          bg.setAttribute('material', 'color: #222; roughness: 0.8; metalness: 0.1; emissive: #111; side: double');
          bg.setAttribute('position', '0 0 -0.02');
          charDisplay.appendChild(bg);

          // Text on the charDisplay entity itself
          charDisplay.setAttribute('text-geometry', 'value: ; size: 0.22; align: center');
          charDisplay.setAttribute('material', 'color: #ffffff; metalness: 0.9; emissive: #111');

          rowEntity.appendChild(charDisplay);
        }
        wordGrid.appendChild(rowEntity);
      }
      
      console.log(`Wordle grid created: ${rows} rows x ${cols} columns`);
    } catch (error) {
      console.error('Error generating Wordle grid:', error);
    }
  }
}); 