import React from 'react';
import { Edit2, Trash2, Play, Pause, Music, ExternalLink } from 'lucide-react';
import { BUTTON_TYPES, AUDIO_TYPES } from '../../utils/constants';

/**
 * Individual sound button component
 * @param {Object} props - Component props
 * @param {Object} props.button - Button configuration object
 * @param {boolean} props.isPlaying - Whether this button is currently playing
 * @param {Function} props.onPlay - Callback when play button is clicked
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 */
const SoundButton = ({ button, isPlaying, onPlay, onEdit, onDelete }) => {
  const hasSpotifyTracks = button.tracks.some(track => track.type === AUDIO_TYPES.SPOTIFY);
  const trackCount = button.tracks.length;
  const isPlaylist = button.type === BUTTON_TYPES.PLAYLIST;

  /**
   * Handle delete with confirmation
   */
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${button.name}"?`)) {
      onDelete();
    }
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 group border border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-xl">
      {/* Header with color indicator and action buttons */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${button.color} ${isPlaying ? 'animate-pulse' : ''}`}></div>
          {hasSpotifyTracks && (
            <ExternalLink className="w-3 h-3 text-green-400" title="Contains Spotify tracks" />
          )}
        </div>
        
        {/* Action buttons - only visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
            title="Edit button"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
            title="Delete button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Button Info */}
      <div className="mb-4">
        <h3 className="font-semibold text-white mb-2 text-sm leading-tight">
          {button.name}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Music className="w-3 h-3" />
          <span>
            {isPlaylist ? `${trackCount} track${trackCount !== 1 ? 's' : ''}` : 'Single sound'}
          </span>
        </div>
        
        {/* Track preview for playlists */}
        {isPlaylist && trackCount > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="truncate">
              {button.tracks[0].name || 'Untitled Track'}
            </div>
            {trackCount > 1 && (
              <div className="text-gray-600">
                +{trackCount - 1} more track{trackCount > 2 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Play Button */}
      <button
        onClick={onPlay}
        className={`w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          isPlaying
            ? 'bg-purple-600 text-white shadow-lg transform scale-105'
            : 'bg-gray-600 hover:bg-gray-500 text-gray-200 hover:shadow-md'
        }`}
        title={isPlaying ? 'Pause playback' : 'Start playback'}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Play
          </>
        )}
      </button>
      
      {/* Additional info overlay for active button */}
      {isPlaying && (
        <div className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none animate-pulse"></div>
      )}
    </div>
  );
};

export default SoundButton;