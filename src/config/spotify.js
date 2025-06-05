// Spotify API configuration
export const SPOTIFY_CONFIG = {
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
  redirectUri: process.env.REACT_APP_REDIRECT_URI || window.location.origin,
  scopes: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative'
  ].join(' ')
};