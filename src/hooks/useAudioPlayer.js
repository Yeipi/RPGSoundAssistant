import { useState, useRef, useEffect, useCallback } from 'react';
import { audioService } from '../services/audioService';

/**
 * Custom hook for managing audio playback state and controls
 * @returns {Object} Audio player state and control functions
 */
export const useAudioPlayer = () => {
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackError, setPlaybackError] = useState(null);
  
  const audioRef = useRef(null);

  // Update audio element volume when volume or mute state changes
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
    // Also update Spotify player volume
    audioService.setVolume(effectiveVolume, audioRef.current);
  }, [volume, isMuted]);

  // Set up audio element event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleDurationChange = () => setDuration(audioElement.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next track if it's a playlist
      if (currentPlaying && currentPlaying.tracks.length > 1) {
        nextTrack();
      }
    };
    const handleError = () => {
      console.error('Audio element error:', audioElement.error);
      setIsPlaying(false);
      setPlaybackError('Audio playback failed. Check the file URL or format.');
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('durationchange', handleDurationChange);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('durationchange', handleDurationChange);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
    };
  }, [currentPlaying]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (playbackError) {
      const timer = setTimeout(() => {
        setPlaybackError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [playbackError]);

  /**
   * Play or pause a sound button
   * @param {Object} button - Sound button to play
   */
  const playSound = useCallback(async (button) => {
    try {
      setPlaybackError(null); // Clear any previous errors

      if (currentPlaying?.id === button.id && isPlaying) {
        // Pause current playback
        console.log('useAudioPlayer: Pausing current track');
        setIsPlaying(false);
        await audioService.pause(audioRef.current);
      } else if (currentPlaying?.id === button.id && !isPlaying) {
        // Resume current playback
        console.log('useAudioPlayer: Resuming current track');
        setIsPlaying(true);
        await audioService.resume(audioRef.current);
      } else {
        // Play new sound/playlist
        console.log('useAudioPlayer: Playing new track');
        setCurrentPlaying(button);
        setCurrentTrackIndex(0);
        setIsPlaying(true);
        
        const track = button.tracks[0];
        
        // Validate track before playing
        if (!track) {
          throw new Error('No tracks found in this button.');
        }

        console.log('useAudioPlayer: Starting playback of track:', track);
        await audioService.play(track, audioRef.current);
      }
    } catch (error) {
      console.error('useAudioPlayer: Error in playSound:', error);
      setIsPlaying(false);
      setPlaybackError(error.message || 'Playback failed. Please try again.');
    }
  }, [currentPlaying, isPlaying]);

  /**
   * Stop current playback
   */
  const stopSound = useCallback(async () => {
    try {
      console.log('useAudioPlayer: Stopping playback');
      setIsPlaying(false);
      setCurrentPlaying(null);
      setCurrentTrackIndex(0);
      setCurrentTime(0);
      setPlaybackError(null);
      await audioService.stop(audioRef.current);
    } catch (error) {
      console.error('useAudioPlayer: Error in stopSound:', error);
      setPlaybackError('Error stopping playback.');
    }
  }, []);

  /**
   * Play next track in playlist
   */
  const nextTrack = useCallback(async () => {
    if (!currentPlaying || currentPlaying.tracks.length <= 1) return;

    try {
      setPlaybackError(null);
      const nextIndex = (currentTrackIndex + 1) % currentPlaying.tracks.length;
      setCurrentTrackIndex(nextIndex);
      
      const track = currentPlaying.tracks[nextIndex];
      console.log('useAudioPlayer: Playing next track:', track);
      await audioService.play(track, audioRef.current);
      setIsPlaying(true);
    } catch (error) {
      console.error('useAudioPlayer: Error in nextTrack:', error);
      setIsPlaying(false);
      setPlaybackError(error.message || 'Error playing next track.');
    }
  }, [currentPlaying, currentTrackIndex]);

  /**
   * Play previous track in playlist
   */
  const previousTrack = useCallback(async () => {
    if (!currentPlaying || currentPlaying.tracks.length <= 1) return;

    try {
      setPlaybackError(null);
      const prevIndex = currentTrackIndex === 0 
        ? currentPlaying.tracks.length - 1 
        : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      
      const track = currentPlaying.tracks[prevIndex];
      console.log('useAudioPlayer: Playing previous track:', track);
      await audioService.play(track, audioRef.current);
      setIsPlaying(true);
    } catch (error) {
      console.error('useAudioPlayer: Error in previousTrack:', error);
      setIsPlaying(false);
      setPlaybackError(error.message || 'Error playing previous track.');
    }
  }, [currentPlaying, currentTrackIndex]);

  /**
   * Seek to specific position in current track
   * @param {number} position - Position in seconds
   */
  const seekTo = useCallback((position) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position;
      setCurrentTime(position);
    }
    // Note: Spotify Web Playback SDK doesn't support seeking in this version
  }, []);

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  /**
   * Set volume level
   * @param {number} newVolume - Volume level (0-1)
   */
  const setVolumeLevel = useCallback((newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  /**
   * Clear playback error
   */
  const clearError = useCallback(() => {
    setPlaybackError(null);
  }, []);

  return {
    // State
    currentPlaying,
    isPlaying,
    currentTrackIndex,
    volume,
    isMuted,
    duration,
    currentTime,
    playbackError,
    
    // Controls
    playSound,
    stopSound,
    nextTrack,
    previousTrack,
    seekTo,
    toggleMute,
    setVolumeLevel,
    clearError,
    
    // Refs
    audioRef,
    
    // Legacy setters (for backward compatibility)
    setVolume: setVolumeLevel,
    setIsMuted
  };
};