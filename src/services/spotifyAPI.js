import { SPOTIFY_CONFIG } from '../config/spotify';

/**
 * Spotify Web API service class with PKCE authentication
 * Handles authentication, search, and playback control
 */
class SpotifyAPI {
  constructor() {
    this.token = null;
    this.baseUrl = 'https://api.spotify.com/v1';
    this.codeVerifier = null;
    this.codeChallenge = null;
  }

  /**
   * Generate code verifier and challenge for PKCE
   */
  generateCodeChallenge() {
    const generateRandomString = (length) => {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    };

    const sha256 = async (plain) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return window.crypto.subtle.digest('SHA-256', data);
    };

    const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    return new Promise(async (resolve) => {
      this.codeVerifier = generateRandomString(64);
      const hashed = await sha256(this.codeVerifier);
      this.codeChallenge = base64encode(hashed);
      
      // Create a state parameter that includes our code_verifier (encoded)
      const state = btoa(JSON.stringify({
        codeVerifier: this.codeVerifier,
        timestamp: Date.now()
      }));
      
      // Store in multiple places as backup
      localStorage.setItem('spotify_code_verifier', this.codeVerifier);
      sessionStorage.setItem('spotify_code_verifier', this.codeVerifier);
      localStorage.setItem('spotify_code_challenge', this.codeChallenge);
      sessionStorage.setItem('spotify_code_challenge', this.codeChallenge);
      window.spotifyCodeVerifier = this.codeVerifier;
      
      console.log('Generated and stored code_verifier:', this.codeVerifier.substring(0, 10) + '...');
      
      resolve(state);
    });
  }

  /**
   * Set the authentication token
   * @param {string} token - Spotify access token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Redirect user to Spotify authentication page using PKCE
   */
  async authenticate() {
    // Generate code challenge first
    const state = await this.generateCodeChallenge();
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CONFIG.clientId,
      scope: SPOTIFY_CONFIG.scopes,
      code_challenge_method: 'S256',
      code_challenge: this.codeChallenge,
      redirect_uri: SPOTIFY_CONFIG.redirectUri,
      state: state,
    });

    console.log('About to redirect to Spotify...');
    console.log('Code verifier stored:', this.codeVerifier.substring(0, 10) + '...');

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * @param {string} code - Authorization code from callback
   * @param {string} state - State parameter with encoded code_verifier
   */
  async getToken(code, state = null) {
    // Try to get code_verifier from state parameter first
    let storedCodeVerifier = null;
    
    if (state) {
      try {
        const stateData = JSON.parse(atob(state));
        storedCodeVerifier = stateData.codeVerifier;
        console.log('Found code_verifier in state parameter');
      } catch (e) {
        console.warn('Could not parse state parameter:', e);
      }
    }
    
    // Fallback to storage methods
    if (!storedCodeVerifier) {
      storedCodeVerifier = localStorage.getItem('spotify_code_verifier') || 
                          sessionStorage.getItem('spotify_code_verifier') ||
                          window.spotifyCodeVerifier;
    }
    
    console.log('Attempting token exchange...');
    console.log('Code:', code.substring(0, 20) + '...');
    console.log('State parameter:', state ? 'Found' : 'Not found');
    console.log('Using code_verifier:', storedCodeVerifier ? storedCodeVerifier.substring(0, 10) + '...' : 'None found');
    
    if (!storedCodeVerifier) {
      throw new Error('Code verifier not found in any storage. Please try authenticating again.');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SPOTIFY_CONFIG.clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_CONFIG.redirectUri,
        code_verifier: storedCodeVerifier,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token exchange error details:', errorData);
      throw new Error(`Token exchange failed: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    this.setToken(data.access_token);
    
    // Store token and expiry in localStorage for persistence
    localStorage.setItem('spotify_access_token', data.access_token);
    localStorage.setItem('spotify_token_expiry', Date.now() + (data.expires_in * 1000));
    
    // Clean up code_verifier from all locations
    localStorage.removeItem('spotify_code_verifier');
    sessionStorage.removeItem('spotify_code_verifier');
    localStorage.removeItem('spotify_code_challenge');
    sessionStorage.removeItem('spotify_code_challenge');
    delete window.spotifyCodeVerifier;
    
    console.log('Token exchange successful!');
    return data.access_token;
  }

  /**
   * Check if we have a valid stored token
   */
  checkStoredToken() {
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    
    if (token && expiry && Date.now() < parseInt(expiry)) {
      this.setToken(token);
      return token;
    }
    
    // Clear expired token
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    return null;
  }

  /**
   * Search for tracks or playlists on Spotify
   * @param {string} query - Search query
   * @param {string} type - 'track' or 'playlist'
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} Search results
   */
  async search(query, type, limit = 20) {
    if (!this.token) throw new Error('No Spotify token available');

    const response = await fetch(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (type === 'track') {
      return data.tracks?.items || [];
    } else {
      return data.playlists?.items || [];
    }
  }

  /**
   * Transfer playback to a specific device
   * @param {string} deviceId - Spotify device ID
   */
  async transferPlayback(deviceId) {
    if (!this.token) throw new Error('No Spotify token available');

    const response = await fetch(`${this.baseUrl}/me/player`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false
      })
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`Spotify transfer playback failed: ${response.statusText}`);
    }
  }

  /**
   * Play a track on the specified device
   * @param {string} deviceId - Spotify device ID
   * @param {string} trackUri - Spotify track URI
   */
  async play(deviceId, trackUri) {
    if (!this.token) throw new Error('No Spotify token available');

    const response = await fetch(`${this.baseUrl}/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [trackUri]
      })
    });

    if (!response.ok && response.status !== 204) {
      const errorData = await response.text();
      console.error('Spotify play error:', errorData);
      throw new Error(`Spotify play failed: ${response.statusText}`);
    }
  }

  /**
   * Pause playback
   */
  async pause() {
    if (!this.token) throw new Error('No Spotify token available');

    const response = await fetch(`${this.baseUrl}/me/player/pause`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`Spotify pause failed: ${response.statusText}`);
    }
  }

  /**
   * Get available devices
   * @returns {Promise<Array>} Available devices
   */
  async getDevices() {
    if (!this.token) throw new Error('No Spotify token available');

    const response = await fetch(`${this.baseUrl}/me/player/devices`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get devices failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.devices || [];
  }
}

// Export singleton instance
export const spotifyAPI = new SpotifyAPI();