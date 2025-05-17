/**
 * Displacement sphere animation updater
 * Animates the displacement offset over time
 */

// Register the component
AFRAME.registerComponent('myoffset-updater', {
  schema: {
    // Animation speed multiplier
    speed: { type: 'number', default: 0.5 },
    
    // Maximum offset value
    maxOffset: { type: 'number', default: 1.0 },
    
    // Whether animation is playing
    paused: { type: 'boolean', default: false }
  },
  
  init() {
    // Initialize time variables
    this.time = 0;
    this.offset = 0;
    
    // Get material if it exists
    const mesh = this.el.getObject3D('mesh');
    if (mesh?.material?.uniforms?.offset) {
      this.material = mesh.material;
    } else {
      console.warn('myoffset-updater: No compatible material found on entity');
    }
    
    // Add pause/play capability with click if not being used for another purpose
    if (!this.el.getAttribute('backgroundButt')) {
      this.el.addEventListener('click', this.togglePause.bind(this));
    }
  },
  
  /**
   * Toggle animation pause state
   */
  togglePause() {
    this.data.paused = !this.data.paused;
    console.log(`Animation ${this.data.paused ? 'paused' : 'playing'}`);
  },
  
  /**
   * Update animation on each frame
   * @param {number} timeDelta - Time since last frame in milliseconds
   */
  tick(timeDelta) {
    // Skip if paused or material not found
    if (this.data.paused || !this.material) return;
    
    try {
      // Convert to seconds and apply speed
      const deltaSeconds = timeDelta / 1000 * this.data.speed;
      
      // Update time and calculate new offset with sin wave
      this.time += deltaSeconds;
      this.offset = Math.sin(this.time) * this.data.maxOffset;
      
      // Apply offset to shader uniform
      if (this.material.uniforms && this.material.uniforms.offset) {
        this.material.uniforms.offset.value = this.offset;
      }
    } catch (error) {
      console.error('Error in myoffset-updater tick:', error);
    }
  }
});
