import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  ExternalLink 
} from 'lucide-react';
import { AUDIO_TYPES } from '../../utils/constants';

/**
 * Player controls component for managing audio playback
 * @param {Object} props - Component props
 * @param {Object} props.currentPlaying - Currently playing button object
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 * @param {number} props.currentTrackIndex - Index of current track in playlist
 * @param {number} props.volume - Current volume level (0-1)
 * @param {boolean} props.isMuted - Whether audio is muted
 * @param {number} props.currentTime - Current playback time in seconds
 * @param {number} props.duration - Total track duration in seconds
 * @param {Function} props.onPlayPause - Callback to toggle play/pause
 * @param {Function} props.onStop - Callback to stop playback
 * @param {Function} props.onNext - Callback to play next track
 * @param {Function} props.onPrevious - Callback to play previous track
 * @param {Function} props.onVolumeChange - Callback when volume changes
 * @param {Function} props.onMuteToggle - Callback to toggle mute
 * @param {Function} props.onSeek - Callback to seek to specific time
 */
const PlayerControls = ({
  currentPlaying,
  isPlaying,
  currentTrackIndex,
  volume,
  isMuted,
  currentTime = 0,
  duration = 0,
  onPlayPause,
  onStop,
  onNext,
  onPrevious,
  onVolumeChange,
  onMuteToggle,
  onSeek
}) => {
  const currentTrack = currentPlaying.tracks[currentTrackIndex];
  const hasMultipleTracks = currentPlaying.tracks.length > 1;
  
  /**
   * Format time in MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Handle progress bar click to seek
   * @param {Event} e - Click event
   */
  const handleProgressClick = (e) => {
    if (!onSeek || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-xl border border-gray-700">
      {/* Track Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Color indicator */}
          <div className={`w-4 h-4 rounded-full ${currentPlaying.color} animate-pulse`}></div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white">{currentPlaying.name}</h3>
            <p className="text-gray-300">
              {currentTrack?.name || 'Untitled Track'}
              {hasMultipleTracks && (
                <span className="ml-2 text-gray-400">
                  ({currentTrackIndex + 1}/{currentPlaying.tracks.length})
                </span>
              )}
            </p>
            
            {/* Track type indicator */}
            <div className="flex items-center gap-2 mt-1">
              {currentTrack?.type === AUDIO_TYPES.SPOTIFY ? (
                <div className="flex items-center gap-1 text-green-400">
                  <ExternalLink className="w-3 h-3" />
                  <span className="text-xs font-medium">Spotify</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500">Local Audio</span>
              )}
              
              {currentTrack?.url && (
                <a
                  href={currentTrack.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                >
                  View Source
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Track */}
          {hasMultipleTracks && (
            <button
              onClick={onPrevious}
              className="p-2 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
              title="Previous track"
            >
              <SkipBack className="w-5 h-5" />
            </button>
          )}
          
          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors shadow-lg transform hover:scale-105"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          {/* Next Track */}
          {hasMultipleTracks && (
            <button
              onClick={onNext}
              className="p-2 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
              title="Next track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          )}
          
          {/* Stop */}
          <button
            onClick={onStop}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            title="Stop playback"
          >
            <Square className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-2 bg-gray-600 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
      
      {/* Volume Control */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMuteToggle}
          className="text-gray-400 hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <div className="flex-1 flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
            }}
          />
          <span className="text-sm text-gray-400 min-w-[3rem] text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;