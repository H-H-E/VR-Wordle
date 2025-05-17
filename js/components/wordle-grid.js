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
    
    // Set initial state
    this.currentRow = 0;
    this.targetWord = "WORLD"; // Default word, can be set from outside
    
    // Listen for word submissions
    this.el.addEventListener('wordsubmit', this.onWordSubmit.bind(this));
    
    // Listen for live updates
    this.el.addEventListener('letterupdate', this.onLetterUpdate.bind(this));
    this.el.addEventListener('letterdelete', this.onLetterDelete.bind(this));
    
    console.log("Wordle grid component initialized and listening for 'wordsubmit' events");
  },
  
  /**
   * Update the letters in the current row as they're typed
   */
  onLetterUpdate(event) {
    const currentWord = event.detail.word;
    
    // Make sure we haven't used all rows
    if (this.currentRow >= this.data.rows) {
      console.log("Game over - all rows used");
      return;
    }
    
    // Get the current row
    const rowId = `row${this.currentRow + 1}`;
    const rowEl = this.el.querySelector(`#${rowId}`);
    if (!rowEl) {
      console.error(`Row element #${rowId} not found`);
      return;
    }
    
    // For each letter in the current word
    const charDisplays = rowEl.querySelectorAll('.charDisplay');
    for (let i = 0; i < currentWord.length && i < this.data.cols; i++) {
      const letter = currentWord[i];
      const charDisplay = charDisplays[i];
      
      // Set the letter with a neutral color (not evaluated yet)
      charDisplay.setAttribute('text-geometry', `value: ${letter}; size: 0.22; align: center`);
      
      // Set a temporary, neutral style
      charDisplay.setAttribute('material', 'color: #ffffff; metalness: 0.9; emissive: #111');
      
      // Add a small animation
      charDisplay.setAttribute('animation', 'property: scale; from: 1.1 1.1 1.1; to: 1 1 1; dur: 100; easing: easeOutQuad;');
    }
    
    // Clear any remaining letters in the row
    for (let i = currentWord.length; i < this.data.cols; i++) {
      const charDisplay = charDisplays[i];
      charDisplay.setAttribute('text-geometry', 'value: ; size: 0.22; align: center');
    }
  },
  
  /**
   * Handle backspace/delete letter
   */
  onLetterDelete(event) {
    const currentWord = event.detail.word;
    
    // Get the current row
    const rowId = `row${this.currentRow + 1}`;
    const rowEl = this.el.querySelector(`#${rowId}`);
    if (!rowEl) {
      return;
    }
    
    // Get the tile that was just cleared
    const charDisplays = rowEl.querySelectorAll('.charDisplay');
    const deletedIndex = currentWord.length;
    
    if (deletedIndex < this.data.cols) {
      const charDisplay = charDisplays[deletedIndex];
      charDisplay.setAttribute('text-geometry', 'value: ; size: 0.22; align: center');
      charDisplay.setAttribute('animation', 'property: scale; from: 0.9 0.9 0.9; to: 1 1 1; dur: 100;');
    }
  },
  
  /**
   * Handle word submissions from the keyboard
   */
  onWordSubmit(event) {
    console.log("Received wordsubmit event with word:", event.detail.word);
    
    const submittedWord = event.detail.word;
    if (!submittedWord || submittedWord.length !== 5) {
      console.error("Invalid word submitted:", submittedWord);
      return;
    }
    
    // Make sure we haven't used all rows
    if (this.currentRow >= this.data.rows) {
      console.log("Game over - all rows used");
      return;
    }
    
    // Get the current row
    const rowId = `row${this.currentRow + 1}`;
    const rowEl = this.el.querySelector(`#${rowId}`);
    if (!rowEl) {
      console.error(`Row element #${rowId} not found`);
      return;
    }
    
    // For each letter in the submitted word
    const charDisplays = rowEl.querySelectorAll('.charDisplay');
    let correctLetters = 0;
    
    for (let i = 0; i < submittedWord.length; i++) {
      const letter = submittedWord[i];
      const charDisplay = charDisplays[i];
      
      // Set the letter
      charDisplay.setAttribute('text-geometry', `value: ${letter}; size: 0.22; align: center`);
      
      // Determine the color based on correctness
      let color = '#666666'; // Default gray for incorrect
      
      if (letter === this.targetWord[i]) {
        // Letter is in correct position
        color = '#00d600'; // Green
        correctLetters++;
        this.el.dispatchEvent(new CustomEvent('tilecorrect'));
      } else if (this.targetWord.includes(letter)) {
        // Letter is in the word but wrong position
        color = '#ffcc00'; // Yellow
        this.el.dispatchEvent(new CustomEvent('tileincorrect'));
      } else {
        // Letter is not in the word
        this.el.dispatchEvent(new CustomEvent('tileincorrect'));
      }
      
      // Set the letter color and make the tile pop
      charDisplay.setAttribute('material', `color: ${color}; metalness: 0.9; emissive: #222`);
      charDisplay.setAttribute('animation', 'property: scale; to: 1.1 1.1 1.1; dur: 200; easing: easeOutQuad; dir: alternate; loop: 1');
    }
    
    // Move to the next row
    this.currentRow++;
    
    // Check if the game is won
    if (correctLetters === 5) {
      console.log("VICTORY! Word correctly guessed");
      const victoryEl = document.getElementById('victory');
      if (victoryEl) {
        victoryEl.setAttribute('troika-text', 'value', 'VICTORY!');
      }
    }
    
    // Check if the game is over
    if (this.currentRow >= this.data.rows && correctLetters < 5) {
      console.log("GAME OVER! The word was", this.targetWord);
      const victoryEl = document.getElementById('victory');
      if (victoryEl) {
        victoryEl.setAttribute('troika-text', 'value', `The word was ${this.targetWord}`);
      }
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
      const cellSpacing = 0.31;   // Horizontal spacing between tiles
      const rowSpacing  = 0.35;   // Vertical spacing between rows
      const tileSize    = 0.29;   // Width/height of each tile background
      
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