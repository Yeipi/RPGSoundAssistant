import React from 'react';
import { Music, Plus, ExternalLink, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Header component with app title and main action buttons
 * @param {Object} props - Component props
 * @param {boolean} props.spotifyConnected - Whether Spotify is connected
 * @param {Object} props.spotifyPlayer - Spotify player instance
 * @param {string} props.deviceId - Spotify device ID
 * @param {Function} props.onConnectSpotify - Callback to connect to Spotify
 * @param {Function} props.onDisconnectSpotify - Callback to disconnect from Spotify
 * @param {Function} props.onAddButton - Callback to add new sound button
 */
const Header = ({ 
  spotifyConnected, 
  spotifyPlayer,
  deviceId,
  onConnectSpotify, 
  onDisconnectSpotify, 
  onAddButton 
}) => {
  // Determine Spotify status
  const getSpotifyStatus = () => {
    if (!spotifyConnected) {
      return { status: 'disconnected', text: 'Connect Spotify', color: 'bg-green-600 hover:bg-green-700' };
    } else if (spotifyConnected && !spotifyPlayer) {
      return { status: 'connecting', text: 'Spotify Connecting...', color: 'bg-yellow-600' };
    } else if (spotifyConnected && spotifyPlayer && !deviceId) {
      return { status: 'no-device', text: 'Spotify Player Loading...', color: 'bg-yellow-600' };
    } else if (spotifyConnected && spotifyPlayer && deviceId) {
      return { status: 'ready', text: 'Spotify Ready', color: 'bg-green-600' };
    }
    return { status: 'unknown', text: 'Spotify Status Unknown', color: 'bg-gray-600' };
  };

  const spotifyStatus = getSpotifyStatus();

  return (
    <header className="flex items-center justify-between mb-8">
      {/* App Title */}
      <div className="flex items-center gap-3">
        <Music className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          RPG Sound Assistant
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Spotify Connection */}
        {!spotifyConnected ? (
          <button
            onClick={onConnectSpotify}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            title="Connect to Spotify for access to millions of songs"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Connect Spotify</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${spotifyStatus.color}`}>
              {spotifyStatus.status === 'ready' ? (
                <CheckCircle className="w-4 h-4 text-green-300" />
              ) : spotifyStatus.status === 'connecting' || spotifyStatus.status === 'no-device' ? (
                <div className="w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-300" />
              )}
              <span className="text-sm font-medium">{spotifyStatus.text}</span>
            </div>
            {onDisconnectSpotify && (
              <button
                onClick={onDisconnectSpotify}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Disconnect from Spotify"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={onAddButton}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          title="Add new sound button"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Button</span>
        </button>
      </div>
    </header>
  );
};

export default Header;