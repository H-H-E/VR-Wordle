# VR-Wordle

A virtual reality adaptation of the popular Wordle word game, built with A-Frame and WebVR.

![VR-Wordle Screenshot](assets/images/wf.jpeg)

## Overview

VR-Wordle brings the addictive word-guessing gameplay of Wordle into a fully interactive 3D environment. Players use a virtual keyboard to guess a hidden five-letter word within six attempts, with visual feedback for correct letters and positions.

## Features

- **Immersive 3D Environment**: Experience Wordle in a virtual reality space with environment themes and dynamic lighting
- **Interactive VR Keyboard**: Type your guesses using a virtual keyboard in 3D space
- **Multiple Themes**: Switch between different environmental themes (starry, egypt, forest, dream, volcano)
- **Speech Recognition**: Experimental voice input support using Web Speech API
- **Responsive Design**: Playable in both VR mode (with headset) and desktop mode

## How to Play

1. **Visit the Game**: Load the index.html file in a WebVR-compatible browser
2. **Start Guessing**: Use the virtual keyboard to type your guess
3. **Get Feedback**: Letters will change color to indicate correctness:
   - Green: Letter is correct and in right position
   - Yellow: Letter is correct but in wrong position
   - Grey: Letter is not in the word
4. **Win the Game**: Guess the correct word within six attempts

## Dependencies

- [A-Frame](https://aframe.io/) - WebVR framework
- [A-Frame Environment Component](https://github.com/feiss/aframe-environment-component) - 3D environments
- [A-Frame GUI](https://github.com/rdub80/aframe-gui) - UI components
- [A-Frame Text Geometry](https://github.com/supermedium/aframe-text-geometry-component) - 3D text
- [Troika Text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) - High-performance text rendering

## Installation and Local Development

### Prerequisites

- Modern web browser with WebVR support (e.g., Firefox, Chrome)
- VR headset (optional)

### Running Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd VR-Wordle
   ```

2. Start a local web server:
   ```bash
   # Using Python 3
   python -m http.server
   
   # Or using Node.js
   npx serve
   ```

3. Open your browser and navigate to `http://localhost:8000`

## Project Structure

```
VR-Wordle/
├── assets/
│   ├── images/        # Image assets
│   ├── models/        # 3D models
├── js/
│   ├── components/    # A-Frame components
│   ├── words.js       # Word dictionary
│   ├── stt.js         # Speech recognition
│   ├── gui.js         # UI helpers
├── index.html         # Main game
├── demos/             # Demo files
├── style.css          # CSS styling
```

## Controls

- **Desktop**: Mouse for interaction, keyboard for typing
- **VR**: Controller ray for pointing and clicking on the virtual keyboard
- **Environment Switch**: Click the floating sphere to switch themes

## Performance Considerations

- The application uses optimized lighting and geometry settings
- Text rendering leverages Troika Text for improved performance
- Environment quality can be adjusted for lower-end devices

## Browser Compatibility

- Chrome 79+ with WebVR/WebXR support
- Firefox 73+ with WebVR/WebXR support
- Oculus Browser
- Mobile browsers with WebVR/WebXR support

## Future Enhancements

- Multiplayer support
- Additional word categories
- Customizable difficulty levels
- Enhanced accessibility features

## Credits

- Word lists derived from standard English dictionaries
- Environment textures from A-Frame Environment Component
- 3D models and assets created for this project

## License

This project is licensed under the MIT License - see the LICENSE file for details.