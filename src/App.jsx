import React, { useState } from 'react';
import Header from './components/Header/Header';
import PlayerControls from './components/PlayerControls/PlayerControls';
import SoundButton from './components/SoundButton/SoundButton';
import ButtonModal from './components/ButtonModal/ButtonModal';
import SpotifySearch from './components/SpotifySearch/SpotifySearch';
import { useSoundButtons } from './hooks/useSoundButtons';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useSpotify } from './hooks/useSpotify';
import { AUDIO_TYPES } from './utils/constants';

/**
 * Main App component
 * RPG Sound Assistant - A tool for game masters to manage audio during tabletop RPG sessions
 */
function App() {
  // Custom hooks for state management
  const {
    soundButtons,
    addSoundButton,
    editSoundButton,
    deleteSoundButton,
    showAddModal,
    showEditModal,
    editingButton,
    setShowAddModal,
    setShowEditModal,
    setEditingButton,
    closeModals
  } = useSoundButtons();

  const {
    currentPlaying,
    isPlaying,
    currentTrackIndex,
    volume,
    isMuted,
    currentTime,
    duration,
    playSound,
    stopSound,
    nextTrack,
    previousTrack,
    seekTo,
    toggleMute,
    setVolumeLevel,
    audioRef
  } = useAudioPlayer();

  const {
    spotifyToken,
    spotifyPlayer,
    deviceId,
    spotifyConnected,
    showSpotifySearch,
    searchResults,
    searchQuery,
    searchType,
    isLoading,
    connectSpotify,
    disconnectSpotify,
    searchSpotify,
    clearSearch,
    closeSpotifySearch,
    setShowSpotifySearch,
    setSearchQuery,
    setSearchType
  } = useSpotify();

  // Local state for Spotify search context
  const [currentTrackForSearch, setCurrentTrackForSearch] = useState(null);

  /**
   * Handle opening Spotify search modal
   * @param {Object} searchContext - Context with button and trackIndex
   */
  const handleOpenSpotifySearch = (searchContext) => {
    console.log('Opening Spotify search with context:', searchContext);
    setCurrentTrackForSearch(searchContext);
    setShowSpotifySearch(true);
  };

  /**
   * Handle selecting a track from Spotify search
   * @param {Object} spotifyItem - Selected Spotify track or playlist
   */
  const handleSelectSpotifyTrack = (spotifyItem) => {
    const spotifyTrack = {
      name: searchType === 'track' 
        ? `${spotifyItem.name} - ${spotifyItem.artists?.[0]?.name || 'Unknown Artist'}`
        : spotifyItem.name,
      url: spotifyItem.external_urls?.spotify || '',
      type: AUDIO_TYPES.SPOTIFY,
      spotifyId: spotifyItem.id,
      spotifyUri: spotifyItem.uri,
      image: searchType === 'track' 
        ? spotifyItem.album?.images?.[0]?.url 
        : spotifyItem.images?.[0]?.url
    };

    console.log('Selected Spotify track:', spotifyTrack);
    console.log('Current track context:', currentTrackForSearch);

    // If we have a track context, update the specific track
    if (currentTrackForSearch && currentTrackForSearch.button) {
      const { button, trackIndex } = currentTrackForSearch;
      
      // Create updated tracks array with the new Spotify track data
      const updatedTracks = button.tracks.map((track, index) =>
        index === trackIndex ? { ...track, ...spotifyTrack } : track
      );
      
      // Create updated button with new tracks
      const updatedButton = { 
        ...button, 
        tracks: updatedTracks 
      };
      
      console.log('Updating button with new track:', updatedButton);
      console.log('Updated track at index', trackIndex, ':', updatedTracks[trackIndex]);
      console.log('Is editing mode?', showEditModal);
      
      // Update the editing button state - this works for both editing and creating
      setEditingButton(updatedButton);
    }

    // Close search and reset context
    closeSpotifySearch();
    setCurrentTrackForSearch(null);
  };

  /**
   * Handle sound button deletion with current playing check
   * @param {number} buttonId - ID of button to delete
   */
  const handleDeleteButton = (buttonId) => {
    // Stop current playback if this button is playing
    if (currentPlaying?.id === buttonId) {
      stopSound();
    }
    deleteSoundButton(buttonId);
  };

  /**
   * Handle edit button click
   * @param {Object} button - Button to edit
   */
  const handleEditButton = (button) => {
    console.log('Editing button:', button);
    setEditingButton({ ...button });
    setShowEditModal(true);
  };

  /**
   * Handle closing all modals
   */
  const handleCloseModals = () => {
    closeModals();
    setCurrentTrackForSearch(null);
    // Clear editingButton when closing modals
    setEditingButton(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <Header
          spotifyConnected={spotifyConnected}
          spotifyPlayer={spotifyPlayer}
          deviceId={deviceId}
          onConnectSpotify={connectSpotify}
          onDisconnectSpotify={disconnectSpotify}
          onAddButton={() => setShowAddModal(true)}
        />

        {/* Player Controls (shown when something is playing) */}
        {currentPlaying && (
          <PlayerControls
            currentPlaying={currentPlaying}
            isPlaying={isPlaying}
            currentTrackIndex={currentTrackIndex}
            volume={volume}
            isMuted={isMuted}
            currentTime={currentTime}
            duration={duration}
            onPlayPause={() => playSound(currentPlaying)}
            onStop={stopSound}
            onNext={nextTrack}
            onPrevious={previousTrack}
            onVolumeChange={setVolumeLevel}
            onMuteToggle={toggleMute}
            onSeek={seekTo}
          />
        )}

        {/* Sound Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {soundButtons.map((button) => (
            <SoundButton
              key={button.id}
              button={button}
              isPlaying={currentPlaying?.id === button.id && isPlaying}
              onPlay={() => playSound(button)}
              onEdit={() => handleEditButton(button)}
              onDelete={() => handleDeleteButton(button.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {soundButtons.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M13.829 8.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.757 3.828 1 1 0 11-1.414-1.414A3.983 3.983 0 0015 12a3.983 3.983 0 00-1.171-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Sound Buttons Yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Create your first sound button to start managing audio for your RPG sessions. 
                You can add local audio files or connect to Spotify for access to millions of tracks.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create Your First Button
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Button Modal */}
        {(showAddModal || showEditModal) && (
          <ButtonModal
            isOpen={showAddModal || showEditModal}
            isEditing={showEditModal}
            editingButton={editingButton}
            spotifyConnected={spotifyConnected}
            onSave={showAddModal ? addSoundButton : editSoundButton}
            onClose={handleCloseModals}
            onOpenSpotifySearch={handleOpenSpotifySearch}
          />
        )}

        {/* Spotify Search Modal */}
        {showSpotifySearch && (
          <SpotifySearch
            isOpen={showSpotifySearch}
            searchQuery={searchQuery}
            searchType={searchType}
            searchResults={searchResults}
            isLoading={isLoading}
            onSearch={searchSpotify}
            onQueryChange={setSearchQuery}
            onTypeChange={setSearchType}
            onSelectTrack={handleSelectSpotifyTrack}
            onClose={closeSpotifySearch}
          />
        )}

        {/* Hidden audio element for local playback */}
        <audio 
          ref={audioRef} 
          preload="metadata"
          onError={(e) => console.error('Audio error:', e)}
        />

        {/* Spotify Premium Required Notice */}
        {spotifyConnected && (
          <div className="fixed bottom-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-sm z-40">
            <p className="font-medium">📢 Spotify Premium Required</p>
            <p className="text-xs mt-1">
              Spotify tracks require a Premium account for playback. Local audio files work with any account.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            RPG Sound Assistant - Enhance your tabletop gaming experience
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Made for Game Masters, by Game Masters
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;