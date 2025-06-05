import { useState, useEffect, useCallback, useRef } from 'react';
import { spotifyAPI } from '../services/spotifyAPI';
import { audioService } from '../services/audioService';
import { SEARCH_TYPES } from '../utils/constants';

/**
 * Custom hook for managing Spotify integration with PKCE authentication
 * @returns {Object} Spotify state and control functions
 */
export const useSpotify = () => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [showSpotifySearch, setShowSpotifySearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState(SEARCH_TYPES.TRACK);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to prevent double execution of token exchange
  const tokenExchangeInProgress = useRef(false);
  const hasProcessedAuthCode = useRef(false);
  const sdkLoadedRef = useRef(false);

  // Initialize Spotify connection on component mount
  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasProcessedAuthCode.current) {
      return;
    }

    console.log('useSpotify: Initializing...');

    // Check for stored token first
    const storedToken = spotifyAPI.checkStoredToken();
    if (storedToken) {
      console.log('useSpotify: Found stored token');
      setSpotifyToken(storedToken);
      setSpotifyConnected(true);
      // Load SDK only when we have a token
      loadSpotifySDK(storedToken);
      hasProcessedAuthCode.current = true;
      return;
    }

    // Check for authorization code in URL after authentication redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Spotify authentication error:', error);
      // Clean up URL on error
      window.history.replaceState({}, document.title, window.location.pathname);
      hasProcessedAuthCode.current = true;
      return;
    }
    
    if (code && !tokenExchangeInProgress.current) {
      console.log('useSpotify: Found authorization code, starting token exchange');
      hasProcessedAuthCode.current = true;
      // Clean up URL immediately to prevent re-processing
      window.history.replaceState({}, document.title, window.location.pathname);
      // Exchange code for token
      exchangeCodeForToken(code, state);
    } else if (!code) {
      // No code, no stored token - user needs to authenticate
      console.log('useSpotify: No code or stored token found');
      hasProcessedAuthCode.current = true;
    }
  }, []); // Empty dependency array to run only once

  /**
   * Exchange authorization code for access token
   * @param {string} code - Authorization code
   * @param {string} state - State parameter with encoded data
   */
  const exchangeCodeForToken = async (code, state = null) => {
    if (tokenExchangeInProgress.current) {
      console.log('useSpotify: Token exchange already in progress, skipping');
      return;
    }

    tokenExchangeInProgress.current = true;
    console.log('useSpotify: Starting token exchange...');

    try {
      const token = await spotifyAPI.getToken(code, state);
      console.log('useSpotify: Token exchange successful');
      setSpotifyToken(token);
      setSpotifyConnected(true);
      
      // Load Spotify Web Playback SDK with the new token
      loadSpotifySDK(token);
    } catch (error) {
      console.error('useSpotify: Error exchanging code for token:', error);
      setSpotifyConnected(false);
      setSpotifyToken(null);
    } finally {
      tokenExchangeInProgress.current = false;
    }
  };

  /**
   * Load Spotify Web Playback SDK
   * @param {string} token - Spotify access token
   */
  const loadSpotifySDK = (token) => {
    console.log('useSpotify: Loading Spotify SDK with token...');
    
    if (!token) {
      console.error('useSpotify: Cannot load SDK without token');
      return;
    }

    if (window.Spotify && sdkLoadedRef.current) {
      console.log('useSpotify: Spotify SDK already loaded, initializing player');
      initializeSpotifyPlayer(token);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
    if (existingScript && !sdkLoadedRef.current) {
      console.log('useSpotify: Spotify SDK script already exists, waiting for load');
      window.onSpotifyWebPlaybackSDKReady = () => initializeSpotifyPlayer(token);
      return;
    }

    // Load SDK script if not already loaded
    console.log('useSpotify: Loading Spotify SDK script');
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    
    // Set up callback for when SDK is ready
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('useSpotify: SDK ready, initializing player');
      sdkLoadedRef.current = true;
      initializeSpotifyPlayer(token);
    };
    
    script.onerror = () => {
      console.error('useSpotify: Failed to load Spotify SDK');
      setSpotifyConnected(false);
    };
    
    document.body.appendChild(script);
  };

  /**
   * Initialize Spotify Web Playback SDK player
   * @param {string} token - Spotify access token
   */
  const initializeSpotifyPlayer = (token) => {
    if (!token) {
      console.error('useSpotify: Cannot initialize player - no token available');
      return;
    }

    if (!window.Spotify) {
      console.error('useSpotify: Spotify SDK not loaded');
      return;
    }

    console.log('useSpotify: Initializing Spotify player with token');

    const player = new window.Spotify.Player({
      name: 'RPG Sound Assistant',
      getOAuthToken: (callback) => {
        console.log('useSpotify: Spotify requesting OAuth token');
        callback(token);
      },
      volume: 0.7
    });

    // Set up event listeners
    player.addListener('ready', ({ device_id }) => {
      console.log('useSpotify: Spotify player ready with Device ID:', device_id);
      setDeviceId(device_id);
      setSpotifyPlayer(player);
      audioService.setSpotifyPlayer(player, device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
      console.log('useSpotify: Spotify device has gone offline:', device_id);
      setDeviceId(null);
      setSpotifyPlayer(null);
    });

    player.addListener('initialization_error', ({ message }) => {
      console.error('useSpotify: Spotify initialization error:', message);
      setSpotifyConnected(false);
    });

    player.addListener('authentication_error', ({ message }) => {
      console.error('useSpotify: Spotify authentication error:', message);
      // Clear stored token on auth error
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_token_expiry');
      setSpotifyConnected(false);
      setSpotifyToken(null);
      setSpotifyPlayer(null);
      setDeviceId(null);
    });

    player.addListener('account_error', ({ message }) => {
      console.error('useSpotify: Spotify account error:', message);
      console.error('useSpotify: This usually means you need Spotify Premium for Web Playback SDK');
      setSpotifyConnected(false);
    });

    player.addListener('playback_error', ({ message }) => {
      console.error('useSpotify: Spotify playback error:', message);
    });

    // Connect to the player
    console.log('useSpotify: Connecting to Spotify player...');
    player.connect().then(success => {
      if (success) {
        console.log('useSpotify: Successfully connected to Spotify Web Playback SDK');
      } else {
        console.error('useSpotify: Failed to connect to Spotify Web Playback SDK');
        setSpotifyConnected(false);
      }
    });
  };

  /**
   * Redirect user to Spotify authentication
   */
  const connectSpotify = async () => {
    console.log('useSpotify: Starting Spotify authentication');
    hasProcessedAuthCode.current = false; // Reset for new auth
    tokenExchangeInProgress.current = false; // Reset for new auth
    await spotifyAPI.authenticate();
  };

  /**
   * Disconnect from Spotify
   */
  const disconnectSpotify = useCallback(() => {
    console.log('useSpotify: Disconnecting from Spotify');
    
    if (spotifyPlayer) {
      spotifyPlayer.disconnect();
    }
    
    // Clear stored token
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    
    setSpotifyToken(null);
    setSpotifyConnected(false);
    setSpotifyPlayer(null);
    setDeviceId(null);
    spotifyAPI.setToken(null);
    
    // Reset refs
    hasProcessedAuthCode.current = false;
    tokenExchangeInProgress.current = false;
    sdkLoadedRef.current = false;
  }, [spotifyPlayer]);

  /**
   * Search for tracks or playlists on Spotify
   * Using useCallback to prevent function recreation on every render
   */
  const searchSpotify = useCallback(async () => {
    if (!spotifyToken || !searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await spotifyAPI.search(searchQuery, searchType);
      setSearchResults(results);
    } catch (error) {
      console.error('useSpotify: Error searching Spotify:', error);
      // Handle token expiration
      if (error.message.includes('401')) {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiry');
        setSpotifyConnected(false);
        setSpotifyToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [spotifyToken, searchQuery, searchType]);

  /**
   * Clear search results and query
   */
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchQuery('');
  }, []);

  /**
   * Close Spotify search modal
   */
  const closeSpotifySearch = useCallback(() => {
    setShowSpotifySearch(false);
    clearSearch();
  }, [clearSearch]);

  return {
    // State
    spotifyToken,
    spotifyPlayer,
    deviceId,
    spotifyConnected,
    showSpotifySearch,
    searchResults,
    searchQuery,
    searchType,
    isLoading,
    
    // Actions
    connectSpotify,
    disconnectSpotify,
    searchSpotify,
    clearSearch,
    closeSpotifySearch,
    
    // Setters
    setShowSpotifySearch,
    setSearchQuery,
    setSearchType
  };
};