// Button color options for UI customization
export const BUTTON_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500',
  'bg-orange-500', 'bg-teal-500'
];

// Audio source types
export const AUDIO_TYPES = {
  LOCAL: 'local',
  SPOTIFY: 'spotify'
};

// Sound button types
export const BUTTON_TYPES = {
  SINGLE: 'single',
  PLAYLIST: 'playlist'
};

// Spotify search types
export const SEARCH_TYPES = {
  TRACK: 'track',
  PLAYLIST: 'playlist'
};

// Default sound buttons for initial app state
export const DEFAULT_BUTTONS = [
  {
    id: 1,
    name: 'Epic Combat',
    type: BUTTON_TYPES.PLAYLIST,
    tracks: [
      { name: 'Battle Theme 1', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' },
      { name: 'Boss Fight', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' },
      { name: 'Victory Fanfare', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' }
    ],
    color: 'bg-red-500'
  },
  {
    id: 2,
    name: 'Tavern Ambience',
    type: BUTTON_TYPES.PLAYLIST,
    tracks: [
      { name: 'Medieval Tavern', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' },
      { name: 'Cheerful Crowd', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' }
    ],
    color: 'bg-amber-500'
  },
  {
    id: 3,
    name: 'Thunder Sound',
    type: BUTTON_TYPES.SINGLE,
    tracks: [{ name: 'Thunder Sound', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' }],
    color: 'bg-blue-500'
  }
];