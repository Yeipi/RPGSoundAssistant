# RPG Sound Assistant 🎵🎲

A powerful audio management tool for tabletop RPG Game Masters. Create custom sound buttons, manage playlists, and integrate with Spotify to enhance your gaming sessions with immersive audio.

![RPG Sound Assistant](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=RPG+Sound+Assistant)

## ✨ Features

### 🎮 **Game Master Focused**
- **Custom Sound Buttons**: Create buttons for specific scenarios (combat, ambiance, effects)
- **Playlist Support**: Chain multiple tracks for extended scenes
- **Quick Controls**: Play, pause, stop, and skip with keyboard shortcuts
- **Visual Feedback**: Color-coded buttons with real-time status indicators

### 🎵 **Audio Management**
- **Local Audio Support**: Use your own audio files
- **Spotify Integration**: Access millions of tracks (requires Spotify Premium for playback)
- **Volume Control**: Independent volume and mute controls
- **Seamless Playback**: Smooth transitions between tracks

### 🔍 **Spotify Features**
- **Track Search**: Find songs by title, artist, or album
- **Playlist Search**: Discover curated playlists
- **Direct Integration**: Add Spotify tracks directly to your buttons
- **External Links**: Quick access to view tracks on Spotify

### 🎨 **User Experience**
- **Modern Interface**: Dark theme optimized for gaming environments
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Intuitive Controls**: Easy-to-use interface designed for quick access during games
- **Visual Indicators**: Clear status for playing, paused, and connected states

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Spotify Account** (optional, but recommended for full features)

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd rpg-sound-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Spotify (Optional)**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Copy your Client ID
   - Add `http://127.0.0.1:3000` to Redirect URIs

4. **Set up environment variables**
```bash
# Copy the example .env file
cp .env .env.local

# Edit .env.local and add your Spotify Client ID
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_REDIRECT_URI=http://127.0.0.1:3000
```

5. **Start the development server**
```bash
npm start
```

6. **Open your browser**
   - Navigate to `http://127.0.0.1:3000`
   - The app will automatically reload when you make changes

## 📖 Usage Guide

### Creating Your First Sound Button

1. **Click "Add Button"** in the top-right corner
2. **Fill in the details**:
   - **Name**: Descriptive name (e.g., "Epic Combat Music")
   - **Type**: Single sound or Playlist
   - **Color**: Visual identifier for quick recognition
3. **Add audio**:
   - **Local files**: Paste URLs to your audio files
   - **Spotify**: Click "Spotify" button to search and add tracks
4. **Save** your button

### Managing Audio During Games

1. **Click any button** to start playback
2. **Use player controls**:
   - Play/Pause: Toggle playback
   - Stop: Stop and reset to beginning
   - Next/Previous: Navigate playlist tracks
   - Volume: Adjust audio level
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
   - Search and click to add

3. **Requirements**:
   - **Spotify Premium** required for playback control
   - **Free accounts** can still search and view track information

## 🏗️ Project Structure

```
rpg-sound-assistant/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
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
│   └── index.css           # Global styles
├── .env                    # Environment variables template
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🛠️ Development

### Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App (⚠️ irreversible)

### Code Style

- **ES6+ JavaScript**: Modern JavaScript features
- **React Hooks**: Functional components with hooks
- **Modular Architecture**: Separated concerns and reusable components
- **English Comments**: All code documentation in English
- **Consistent Naming**: Clear, descriptive function and variable names

### Adding New Features

1. **Components**: Add to `src/components/[ComponentName]/`
2. **Hooks**: Add to `src/hooks/use[HookName].js`
3. **Services**: Add to `src/services/[serviceName].js`
4. **Constants**: Add to `src/utils/constants.js`

## 🎯 Use Cases

### Combat Encounters
- Create buttons for different combat intensities
- Background music that matches the encounter difficulty
- Victory fanfares for successful battles

### Environmental Ambiance
- Tavern sounds for social encounters
- Forest ambiance for wilderness exploration
- Dungeon atmospheres for underground adventures

### Special Effects
- Thunder and weather effects
- Magic spell sounds
- Dramatic stingers for plot reveals

### Emotional Scenes
- Sad music for character deaths
- Mysterious themes for investigations
- Triumphant music for major victories

## 🔧 Technical Details

### Spotify Integration
- Uses **Spotify Web API** for search functionality
- Uses **Spotify Web Playback SDK** for audio control
- Requires user authentication via OAuth 2.0
- Premium account needed for playback control

### Audio Handling
- **Local files**: Standard HTML5 audio element
- **Spotify tracks**: Web Playback SDK
- **Volume control**: Unified interface for both sources
- **State management**: React hooks for clean state handling

### Responsive Design
- **Mobile-first approach**: Optimized for all screen sizes
- **Touch-friendly**: Large buttons and easy navigation
- **Dark theme**: Reduces eye strain during long gaming sessions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🎮 Happy Gaming!

Enhance your RPG sessions with immersive audio. Create the perfect atmosphere for your adventures!

---

*Made with ❤️ for the RPG community*