import { spotifyAPI } from './spotifyAPI';
import { AUDIO_TYPES } from '../utils/constants';

/**
 * Audio service for handling both local and Spotify playback
 */
class AudioService {
  constructor() {
    this.spotifyPlayer = null;
    this.deviceId = null;
    this.currentSpotifyTrack = null; // Track currently loaded in Spotify
    this.isSpotifyPaused = false; // Track Spotify pause state
  }

  /**
   * Set Spotify player instance
   * @param {Object} player - Spotify Web Playback SDK player
   * @param {string} deviceId - Device ID for this player
   */
  setSpotifyPlayer(player, deviceId) {
    this.spotifyPlayer = player;
    this.deviceId = deviceId;
    console.log('AudioService: Spotify player set with device ID:', deviceId);

    // Listen to Spotify player state changes
    if (player) {
      player.addListener('player_state_changed', (state) => {
        if (state) {
          this.isSpotifyPaused = state.paused;
          console.log('AudioService: Spotify player state changed - paused:', state.paused);
        }
      });
    }
  }

  /**
   * Play a track (either local or Spotify)
   * @param {Object} track - Track object with type, url, spotifyUri, etc.
   * @param {HTMLAudioElement} audioElement - HTML audio element for local playback
   */
  async play(track, audioElement) {
    try {
      console.log('AudioService: Attempting to play track:', track);

      if (track.type === AUDIO_TYPES.SPOTIFY) {
        return await this.playSpotifyTrack(track);
      } else {
        return await this.playLocalTrack(track, audioElement);
      }
    } catch (error) {
      console.error('AudioService: Error playing track:', error);
      throw error;
    }
  }

  /**
   * Play a Spotify track using the Web Playback SDK
   * @param {Object} track - Spotify track object
   */
  async playSpotifyTrack(track) {
    console.log('AudioService: Checking Spotify player status...');
    console.log('- Has player:', !!this.spotifyPlayer);
    console.log('- Has device ID:', !!this.deviceId);
    
    if (!this.spotifyPlayer || !this.deviceId) {
      throw new Error('Spotify player not ready yet. Please wait a moment and try again. Make sure you have Spotify Premium.');
    }

    if (!track.spotifyUri) {
      throw new Error('Spotify URI missing. Cannot play track.');
    }

    // Check if this is the same track that's currently loaded and just paused
    if (this.currentSpotifyTrack === track.spotifyUri && this.isSpotifyPaused) {
      console.log('AudioService: Resuming current Spotify track');
      try {
        await this.spotifyPlayer.resume();
        console.log('AudioService: Spotify track resumed successfully');
        return;
      } catch (error) {
        console.log('AudioService: Resume failed, falling back to play from start:', error.message);
        // Fall through to start track from beginning
      }
    }

    console.log('AudioService: Playing new Spotify track:', track.spotifyUri);

    try {
      // First, make sure this device is the active one
      console.log('AudioService: Transferring playback to device:', this.deviceId);
      await spotifyAPI.transferPlayback(this.deviceId);
      
      // Wait a bit for the transfer to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then play the track
      console.log('AudioService: Starting playback...');
      await spotifyAPI.play(this.deviceId, track.spotifyUri);
      
      // Track the current track
      this.currentSpotifyTrack = track.spotifyUri;
      this.isSpotifyPaused = false;
      
      console.log('AudioService: Spotify track started successfully');
    } catch (error) {
      console.error('AudioService: Spotify playback error details:', error);
      
      if (error.message.includes('Premium')) {
        throw new Error('Spotify Premium required for track playback. Please upgrade your account.');
      } else if (error.message.includes('404')) {
        throw new Error('Track not found on Spotify. It may have been removed.');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('Spotify authentication error. Please reconnect your account.');
      } else if (error.message.includes('502') || error.message.includes('503')) {
        throw new Error('Spotify service temporarily unavailable. Please try again.');
      } else {
        throw new Error(`Spotify playback error: ${error.message}`);
      }
    }
  }

  /**
   * Play a local audio track
   * @param {Object} track - Local track object
   * @param {HTMLAudioElement} audioElement - HTML audio element
   */
  async playLocalTrack(track, audioElement) {
    if (!track.url) {
      throw new Error('No audio URL provided for local track.');
    }

    if (!audioElement) {
      throw new Error('Audio element not available for local playback.');
    }

    console.log('AudioService: Playing local track:', track.url);

    try {
      audioElement.src = track.url;
      await audioElement.play();
      console.log('AudioService: Local track started successfully');
    } catch (error) {
      if (error.name === 'NotSupportedError') {
        throw new Error(`Audio format not supported or file not found: ${track.url}`);
      } else if (error.name === 'NotAllowedError') {
        throw new Error('Browser blocked audio playback. Please interact with the page first.');
      } else if (error.name === 'AbortError') {
        throw new Error('Audio playback was interrupted.');
      } else {
        throw new Error(`Local audio playback error: ${error.message}`);
      }
    }
  }

  /**
   * Pause current playback
   * @param {HTMLAudioElement} audioElement - HTML audio element
   */
  async pause(audioElement) {
    try {
      if (this.spotifyPlayer) {
        await this.spotifyPlayer.pause();
        this.isSpotifyPaused = true;
        console.log('AudioService: Spotify playback paused');
      }
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
        console.log('AudioService: Local audio paused');
      }
    } catch (error) {
      console.error('AudioService: Error pausing playback:', error);
    }
  }

  /**
   * Resume current playback
   * @param {HTMLAudioElement} audioElement - HTML audio element
   */
  async resume(audioElement) {
    try {
      if (this.spotifyPlayer && this.isSpotifyPaused) {
        await this.spotifyPlayer.resume();
        this.isSpotifyPaused = false;
        console.log('AudioService: Spotify playback resumed');
      }
      if (audioElement && audioElement.paused) {
        await audioElement.play();
        console.log('AudioService: Local audio resumed');
      }
    } catch (error) {
      console.error('AudioService: Error resuming playback:', error);
    }
  }

  /**
   * Stop playback and reset position
   * @param {HTMLAudioElement} audioElement - HTML audio element
   */
  async stop(audioElement) {
    try {
      if (this.spotifyPlayer) {
        await this.spotifyPlayer.pause();
        this.isSpotifyPaused = true;
        // Reset current track so next play starts from beginning
        this.currentSpotifyTrack = null;
        console.log('AudioService: Spotify playback stopped');
      }
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        console.log('AudioService: Local audio stopped');
      }
    } catch (error) {
      console.error('AudioService: Error stopping playback:', error);
    }
  }

  /**
   * Set volume for both Spotify and local audio
   * @param {number} volume - Volume level (0-1)
   * @param {HTMLAudioElement} audioElement - HTML audio element
   */
  async setVolume(volume, audioElement) {
    try {
      if (this.spotifyPlayer) {
        await this.spotifyPlayer.setVolume(volume);
      }
      if (audioElement) {
        audioElement.volume = volume;
      }
    } catch (error) {
      console.error('AudioService: Error setting volume:', error);
    }
  }

  /**
   * Get current playback state from Spotify
   * @returns {Promise<Object|null>} Current playback state
   */
  async getCurrentState() {
    try {
      if (this.spotifyPlayer) {
        return await this.spotifyPlayer.getCurrentState();
      }
      return null;
    } catch (error) {
      console.error('AudioService: Error getting current state:', error);
      return null;
    }
  }

  /**
   * Check if Spotify player is ready
   * @returns {boolean} Whether Spotify player is ready
   */
  isSpotifyReady() {
    return !!(this.spotifyPlayer && this.deviceId);
  }

  /**
   * Get current Spotify track info
   * @returns {Object} Current track info
   */
  getCurrentSpotifyTrackInfo() {
    return {
      currentTrack: this.currentSpotifyTrack,
      isPaused: this.isSpotifyPaused
    };
  }
}

// Export singleton instance
export const audioService = new AudioService();