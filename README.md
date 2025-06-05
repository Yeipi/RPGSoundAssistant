# RPG Sound Assistant 🎵🎲

[![GitHub repo](https://img.shields.io/badge/GitHub-RPGSoundAssistant-blue?logo=github)](https://github.com/Yeipi/RPGSoundAssistant)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Spotify](https://img.shields.io/badge/Spotify-Web%20API-1ed760?logo=spotify)](https://developer.spotify.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A powerful audio management tool for tabletop RPG Game Masters. Create custom sound buttons, manage playlists, and integrate with Spotify to enhance your gaming sessions with immersive audio.

![RPG Sound Assistant Demo](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=RPG+Sound+Assistant)

## ✨ Features

### 🎮 **Game Master Focused**
- **Custom Sound Buttons**: Create buttons for specific scenarios (combat, ambiance, effects)
- **Playlist Support**: Chain multiple tracks for extended scenes
- **Quick Controls**: Play, pause, stop, and skip with intuitive interface
- **Visual Feedback**: Color-coded buttons with real-time status indicators

### 🎵 **Audio Management**
- **Local Audio Support**: Use your own audio files (MP3, WAV, OGG)
- **Spotify Integration**: Access millions of tracks (requires Spotify Premium for playback)
- **Volume Control**: Independent volume and mute controls
- **Seamless Playback**: Smooth transitions between tracks with pause/resume functionality

### 🔍 **Spotify Features**
- **Auto Search**: Real-time search as you type
- **Track & Playlist Search**: Find songs by title, artist, album, or discover curated playlists
- **Direct Integration**: Add Spotify tracks directly to your sound buttons
- **External Links**: Quick access to view tracks on Spotify
- **PKCE Authentication**: Secure OAuth 2.0 flow without client secrets

### 🎨 **User Experience**
- **Modern Interface**: Dark theme optimized for gaming environments
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Intuitive Controls**: Easy-to-use interface designed for quick access during games
- **Visual Indicators**: Clear status for playing, paused, and connected states
- **Error Handling**: Robust error management with user-friendly messages

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn**
- **Spotify Account** (Premium required for playback, Free works for search)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Yeipi/RPGSoundAssistant.git
cd RPGSoundAssistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Spotify (Optional but Recommended)**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app with these settings:
     - **Redirect URI**: `http://127.0.0.1:3000` ⚠️ **Important**: Use `127.0.0.1`, NOT `localhost`
   - Copy your Client ID

4. **Set up environment variables**
```bash
# Copy the example .env file
cp .env.example .env.local

# Edit .env.local and add your Spotify Client ID
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_REDIRECT_URI=http://127.0.0.1:3000
```

5. **Start the development server**
```bash
npm start
```

6. **Access the application**
   - Navigate to `http://127.0.0.1:3000` ⚠️ **Important**: Use this address for Spotify integration
   - The app will automatically reload when you make changes

## 📖 Usage Guide

### Creating Your First Sound Button

1. **Click "Add Button"** in the top-right corner
2. **Fill in the details**:
   - **Name**: Descriptive name (e.g., "Epic Combat Music")
   - **Type**: Single sound or Playlist
   - **Color**: Visual identifier for quick recognition
3. **Add audio**:
   - **Local files**: Add URLs to your audio files in `public/audio/`
   - **Spotify**: Click "Spotify" button to search and add tracks automatically
4. **Save** your button

### Managing Audio During Games

1. **Click any button** to start playback
2. **Use player controls**:
   - **Play/Pause**: Toggle playback (maintains position)
   - **Stop**: Stop and reset to beginning
   - **Next/Previous**: Navigate playlist tracks
   - **Volume**: Adjust audio level with unified control
3. **Edit buttons** by hovering and clicking the edit icon
4. **Delete buttons** with the trash icon (requires confirmation)

### Spotify Integration

1. **Connect to Spotify**:
   - Click "Connect Spotify" in the header
   - Log in with your Spotify account
   - Grant permissions to the app

2. **Search for tracks**:
   - When adding/editing tracks, click the Spotify button
   - Toggle between "Tracks" and "Playlists"
   - Auto-search activates as you type
   - Click any result to add it to your button

3. **Requirements**:
   - **Spotify Premium** required for playback control
   - **Free accounts** can still search and view track information
   - **Important**: Access the app via `http://127.0.0.1:3000` for Spotify to work

## 🏗️ Project Structure

```
RPGSoundAssistant/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── audio/              # Place your local audio files here
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header/
│   │   ├── PlayerControls/
│   │   ├── SoundButton/
│   │   ├── ButtonModal/
│   │   └── SpotifySearch/
│   ├── hooks/              # Custom React hooks
│   │   ├── useSoundButtons.js
│   │   ├── useAudioPlayer.js
│   │   └── useSpotify.js
│   ├── services/           # External API services
│   │   ├── spotifyAPI.js
│   │   └── audioService.js
│   ├── utils/              # Constants and helpers
│   │   └── constants.js
│   ├── config/             # Configuration files
│   │   └── spotify.js
│   ├── App.jsx             # Main application component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles with Tailwind
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── README.md               # This file
└── SETUP_INSTRUCTIONS.md   # Detailed setup guide
```

## 🛠️ Development

### Available Scripts

- `npm start`: Run development server at `http://127.0.0.1:3000`
- `npm build`: Build for production
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App (⚠️ irreversible)

### Code Architecture

- **ES6+ JavaScript**: Modern JavaScript features with React Hooks
- **Modular Design**: Separated concerns and reusable components
- **State Management**: Custom hooks for clean state handling
- **Service Layer**: Abstracted API calls and audio management
- **Error Boundaries**: Robust error handling throughout the application

### Key Technologies

- **React 18** with Hooks
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Spotify Web API** for search
- **Spotify Web Playback SDK** for audio control
- **HTML5 Audio API** for local playback

## 🎯 Use Cases

### Combat Encounters
- Create buttons for different combat intensities
- Background music that matches encounter difficulty
- Victory fanfares for successful battles
- Sound effects for critical hits and special abilities

### Environmental Ambiance
- Tavern sounds for social encounters
- Forest ambiance for wilderness exploration
- Dungeon atmospheres for underground adventures
- Weather effects and environmental sounds

### Special Effects
- Thunder and weather effects
- Magic spell sounds with different schools of magic
- Dramatic stingers for plot reveals
- Tension music for investigations

### Emotional Scenes
- Sad music for character deaths
- Mysterious themes for investigations
- Triumphant music for major victories
- Romantic themes for character interactions

## 🔧 Technical Details

### Spotify Integration
- **Authentication**: OAuth 2.0 with PKCE (Proof Key for Code Exchange)
- **Search API**: Real-time search with auto-complete
- **Web Playbook SDK**: Direct audio control (Premium required)
- **Rate Limiting**: Built-in request throttling and error handling

### Audio Handling
- **Local Files**: HTML5 Audio API with format detection
- **Spotify Tracks**: Web Playback SDK with fallback handling
- **Volume Control**: Unified interface for both audio sources
- **State Synchronization**: Seamless switching between local and Spotify audio

### Security
- **No Client Secrets**: Frontend-safe authentication flow
- **Environment Variables**: Secure configuration management
- **CORS Handling**: Proper cross-origin request setup
- **Token Management**: Automatic token refresh and storage

## 📱 Mobile Support

The application is fully responsive and works on:

- **Desktop**: Full feature set with keyboard shortcuts
- **Tablet**: Touch-optimized controls
- **Mobile**: Simplified interface for quick access during games

Access via `http://YOUR_IP:3000` on mobile devices connected to the same network.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and component structure
- Add appropriate error handling for new features
- Update documentation for any new functionality
- Test thoroughly with both local audio and Spotify integration

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚨 Known Issues & Limitations

### Spotify Limitations
- **Premium Required**: Spotify Premium account needed for playback control
- **Rate Limits**: Search requests are limited by Spotify's API
- **Regional Restrictions**: Some tracks may not be available in all regions
- **Device Conflicts**: Only one Spotify device can play at a time

### Browser Limitations
- **Autoplay Policies**: Some browsers require user interaction before audio playback
- **CORS Restrictions**: Local file access may be limited in some browsers
- **Mobile Safari**: May have additional audio limitations

### Workarounds
- **Local Audio**: Use relative URLs starting with `./audio/`
- **File Formats**: Stick to widely supported formats (MP3, WAV)
- **Network Issues**: Check console for detailed error messages

## 📧 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/Yeipi/RPGSoundAssistant/issues) page
2. Review the [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed troubleshooting
3. Create a new issue with:
   - Detailed description of the problem
   - Steps to reproduce
   - Browser and OS information
   - Console error messages (if any)

## 🎮 Happy Gaming!

Enhance your RPG sessions with immersive audio. Create the perfect atmosphere for your adventures and keep your players engaged with dynamic soundscapes!

---

## 📊 Project Stats

- **React Components**: 8 custom components
- **Custom Hooks**: 3 specialized hooks
- **Services**: 2 API service layers
- **Audio Formats**: MP3, WAV, OGG support
- **Spotify Integration**: Full Web API + Playback SDK
- **Responsive Design**: Desktop, tablet, mobile optimized

---

*Made with ❤️ for the RPG community by Game Masters, for Game Masters*

**Repository**: [https://github.com/Yeipi/RPGSoundAssistant](https://github.com/Yeipi/RPGSoundAssistant)