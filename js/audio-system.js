/**
 * Sophisticated Audio System for VR-Wordle
 * Uses Tone.js to create rich, polished soundscapes for adult-oriented interactions
 */

class AudioSystem {
  constructor() {
    this.initialized = false;
    this.reverb = null;
    this.delay = null;
    this.masterVolume = null;
    this.ready = false;
    
    // Different synth types for different interactions
    this.synths = {
      keypress: null,
      backspace: null,
      submit: null,
      success: null,
      failure: null,
      themeChange: null
    };
    
    // Initialize the system when called
    this.init = this.init.bind(this);
  }
  
  /**
   * Initialize the audio system with Tone.js
   */
  async init() {
    if (!window.Tone || this.initialized) return;
    
    try {
      // Start the audio context
      await Tone.start();
      console.log("Tone.js initialized and started");
      
      // Create effects chain
      this.reverb = new Tone.Reverb({
        decay: 1.5,
        wet: 0.2
      }).toDestination();
      
      this.delay = new Tone.FeedbackDelay({
        delayTime: 0.12,
        feedback: 0.1,
        wet: 0.1
      }).connect(this.reverb);
      
      this.masterVolume = new Tone.Volume(-10).connect(this.delay);
      
      // Initialize synths for different interaction types
      
      // Keypress - subtle, clean FM synth with short notes
      this.synths.keypress = new Tone.FMSynth({
        harmonicity: 2,
        modulationIndex: 1,
        oscillator: {
          type: "sine"
        },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.1,
          release: 0.3
        },
        modulation: {
          type: "triangle"
        },
        modulationEnvelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.1,
          release: 0.2
        }
      }).connect(this.masterVolume);
      
      // Backspace - slight percussive tone
      this.synths.backspace = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: {
          type: "sine"
        },
        envelope: {
          attack: 0.001,
          decay: 0.1,
          sustain: 0.05,
          release: 0.1,
          attackCurve: "exponential"
        }
      }).connect(this.masterVolume);
      
      // Submit - richer chord with metallic quality
      this.synths.submit = new Tone.MetalSynth({
        frequency: 200,
        envelope: {
          attack: 0.001,
          decay: 0.1,
          release: 0.1
        },
        harmonicity: 3.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      }).connect(this.masterVolume);
      
      // Success - rich, pleasant chord with longer sustain
      this.synths.success = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: "sine"
        },
        envelope: {
          attack: 0.02,
          decay: 0.3,
          sustain: 0.4,
          release: 1.5
        }
      }).connect(this.masterVolume);
      
      // Failure - tense, dissonant sounds
      this.synths.failure = new Tone.PolySynth(Tone.AMSynth, {
        oscillator: {
          type: "square8"
        },
        envelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.2,
          release: 0.3
        },
        modulation: {
          type: "sawtooth"
        },
        modulationEnvelope: {
          attack: 0.5,
          decay: 0.05,
          sustain: 0.2,
          release: 0.5
        }
      }).connect(this.masterVolume);
      
      // Theme change - atmospheric pad sound
      this.synths.themeChange = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: {
          type: "sine"
        },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.3,
          release: 2
        },
        modulation: {
          type: "square"
        },
        modulationEnvelope: {
          attack: 0.5,
          decay: 0.5,
          sustain: 0.2,
          release: 1.5
        }
      }).connect(this.masterVolume);
      
      this.initialized = true;
      this.ready = true;
      console.log("Audio system initialized successfully");
      
    } catch (err) {
      console.warn("Could not initialize audio system:", err.message);
    }
  }
  
  /**
   * Safely play a sound with appropriate error handling
   */
  safelyPlay(type, notes, duration = "16n") {
    if (!this.ready || !this.synths[type]) return;
    
    try {
      if (Array.isArray(notes)) {
        this.synths[type].triggerAttackRelease(notes, duration);
      } else {
        this.synths[type].triggerAttackRelease(notes, duration);
      }
    } catch (err) {
      console.warn(`Error playing ${type} sound:`, err.message);
    }
  }
  
  /**
   * Play keypress sound - subtle, higher pitched clean tone
   */
  playKeypress() {
    // Use a scale of notes to add variety
    const notes = ["D5", "E5", "F#5", "A5", "B5"];
    const note = notes[Math.floor(Math.random() * notes.length)];
    this.safelyPlay("keypress", note, "32n");
  }
  
  /**
   * Play backspace sound - soft deletion sound
   */
  playBackspace() {
    this.safelyPlay("backspace", "D3", "32n");
  }
  
  /**
   * Play word submission sound - satisfying metal tone
   */
  playSubmit() {
    this.safelyPlay("submit", "A4", "8n");
  }
  
  /**
   * Play error sound for incomplete words - warning tone
   */
  playError() {
    this.safelyPlay("failure", ["D3", "Ab3"], "16n");
  }
  
  /**
   * Play success sound - pleasant chord progression
   */
  playSuccess() {
    // Major seventh chord - rich and pleasant
    this.safelyPlay("success", ["D4", "F#4", "A4", "C#5"], "8n");
  }
  
  /**
   * Play failure sound - minor dissonant chord
   */
  playFailure() {
    // Diminished chord with dissonant intervals
    this.safelyPlay("failure", ["C3", "Eb3", "Gb3"], "16n");
  }
  
  /**
   * Play theme change sound - atmospheric transition
   */
  playThemeChange() {
    // Extended jazz chord for a sophisticated sound
    this.safelyPlay("themeChange", ["D3", "F#3", "A3", "C#4", "E4"], "4n");
  }
}

// Create a singleton instance
const audioSystem = new AudioSystem();

// Export the audio system
window.VRdleAudio = audioSystem; 