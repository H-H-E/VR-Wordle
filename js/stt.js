/**
 * Speech Recognition module for VRdle
 * Uses Web Speech API to recognize spoken words
 */

// Initialize speech recognition with fallbacks for browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

// Use the WORDS array from words.js instead of duplicating the list
// The WORDS list is already loaded from words.js

// Cache DOM elements
const wordPara = document.querySelector('.word');
const resultPara = document.querySelector('.result');
const diagnosticPara = document.querySelector('.output');

const testBtn = document.querySelector('button');

// Create a single recognition instance to reuse
let recognition = null;

/**
 * Gets a random word from the WORDS array
 * @returns {number} Index of a random word
 */
const randomWord = () => {
  try {
    if (!WORDS || !Array.isArray(WORDS) || WORDS.length === 0) {
      console.error('WORDS array is not properly defined');
      return 0;
    }
    return Math.floor(Math.random() * WORDS.length);
  } catch (error) {
    console.error('Error selecting random word:', error);
    return 0;
  }
};

/**
 * Initialize speech recognition
 * @returns {SpeechRecognition|null} Recognition instance or null if not supported
 */
const initSpeechRecognition = () => {
  if (!SpeechRecognition) {
    console.error('Speech Recognition API not supported in this browser');
    return null;
  }
  
  try {
    const instance = new SpeechRecognition();
    instance.lang = 'en-US';
    instance.interimResults = false;
    instance.maxAlternatives = 1;
    return instance;
  } catch (error) {
    console.error('Error initializing speech recognition:', error);
    return null;
  }
};

/**
 * Handles the speech test process
 */
const testSpeech = () => {
  // Disable the button during testing
  if (testBtn) {
    testBtn.disabled = true;
    testBtn.textContent = 'Test in progress';
  }

  // Initialize recognition if not already done
  if (!recognition) {
    recognition = initSpeechRecognition();
    if (!recognition) {
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.textContent = 'Start new test';
      }
      alert('Speech recognition is not supported in your browser');
      return;
    }
  }

  try {
    // Select a random word and prepare UI
    const wordIndex = randomWord();
    const word = WORDS[wordIndex].toLowerCase();
    
    if (wordPara) wordPara.textContent = word;
    if (resultPara) {
      resultPara.textContent = 'Right or wrong?';
      resultPara.style.background = 'rgba(0,0,0,0.2)';
    }
    if (diagnosticPara) {
      diagnosticPara.textContent = '...diagnostic messages';
    }

    // Set up grammar for better recognition
    const grammar = `#JSGF V1.0; grammar word; public <word> = ${word};`;
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    // Set up event handlers
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      if (diagnosticPara) {
        diagnosticPara.textContent = `Speech received: ${speechResult}.`;
      }
      
      if (resultPara) {
        if (speechResult === word) {
          resultPara.textContent = 'I heard the correct word!';
          resultPara.style.background = 'lime';
        } else {
          resultPara.textContent = 'That didn\'t sound right.';
          resultPara.style.background = 'red';
        }
      }

      console.log(`Confidence: ${event.results[0][0].confidence}`);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.textContent = 'Start new test';
      }
    };

    recognition.onerror = (event) => {
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.textContent = 'Start new test';
      }
      if (diagnosticPara) {
        diagnosticPara.textContent = `Error occurred in recognition: ${event.error}`;
      }
      console.error('Speech recognition error:', event.error);
    };
    
    // Debug event handlers
    recognition.onaudiostart = () => console.log('SpeechRecognition.onaudiostart');
    recognition.onaudioend = () => console.log('SpeechRecognition.onaudioend');
    recognition.onend = () => console.log('SpeechRecognition.onend');
    recognition.onnomatch = () => console.log('SpeechRecognition.onnomatch');
    recognition.onsoundstart = () => console.log('SpeechRecognition.onsoundstart');
    recognition.onsoundend = () => console.log('SpeechRecognition.onsoundend');
    recognition.onspeechstart = () => console.log('SpeechRecognition.onspeechstart');
    recognition.onstart = () => console.log('SpeechRecognition.onstart');

    // Start recognition
    recognition.start();
  } catch (error) {
    console.error('Error in speech test:', error);
    if (testBtn) {
      testBtn.disabled = false;
      testBtn.textContent = 'Start new test';
    }
    if (diagnosticPara) {
      diagnosticPara.textContent = `Error: ${error.message}`;
    }
  }
};

// Add event listener if button exists
if (testBtn) {
  testBtn.addEventListener('click', testSpeech);
}
