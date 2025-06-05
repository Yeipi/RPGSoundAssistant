import React, { useState, useEffect } from 'react';
import { X, Search, Trash2, ExternalLink, Music, Plus } from 'lucide-react';
import { BUTTON_COLORS, BUTTON_TYPES, AUDIO_TYPES } from '../../utils/constants';

/**
 * Modal component for adding or editing sound buttons
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {boolean} props.isEditing - Whether we're editing (true) or adding (false)
 * @param {Object} props.editingButton - Button object being edited (if isEditing)
 * @param {boolean} props.spotifyConnected - Whether Spotify is connected
 * @param {Function} props.onSave - Callback to save the button
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onOpenSpotifySearch - Callback to open Spotify search
 */
const ButtonModal = ({
  isOpen,
  isEditing,
  editingButton,
  spotifyConnected,
  onSave,
  onClose,
  onOpenSpotifySearch
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: BUTTON_TYPES.SINGLE,
    tracks: [{ name: '', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' }],
    color: 'bg-green-500'
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens or editing button changes
  useEffect(() => {
    if (editingButton) {
      // Use editingButton for BOTH editing and creating (when it has updated data from Spotify)
      console.log('ButtonModal: Setting form data from editingButton:', editingButton);
      const newFormData = {
        ...editingButton,
        tracks: editingButton.tracks.map(track => ({ ...track }))
      };
      setFormData(newFormData);
      console.log('ButtonModal: Form data initialized:', newFormData);
    } else if (!isEditing) {
      // Only use default values when there's no editingButton at all
      setFormData({
        name: '',
        type: BUTTON_TYPES.SINGLE,
        tracks: [{ name: '', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' }],
        color: 'bg-green-500'
      });
    }
    setErrors({});
  }, [editingButton, isOpen]);

  // Watch for changes in editingButton and update formData accordingly
  useEffect(() => {
    if (editingButton && isOpen) {
      console.log('ButtonModal: editingButton changed:', editingButton);
      
      // Force update by creating completely new objects
      const newFormData = {
        ...editingButton,
        tracks: editingButton.tracks.map(track => ({ ...track }))
      };
      
      console.log('ButtonModal: Setting new form data:', newFormData);
      setFormData(newFormData);
    }
  }, [editingButton]);

  // Additional effect to watch for changes in editingButton.tracks specifically
  useEffect(() => {
    if (editingButton && editingButton.tracks && isOpen) {
      console.log('ButtonModal: Tracks changed, forcing update');
      setFormData(prev => ({
        ...prev,
        tracks: editingButton.tracks.map(track => ({ ...track }))
      }));
    }
  }, [editingButton?.tracks, isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  /**
   * Update a specific track in the form data
   * @param {number} trackIndex - Index of track to update
   * @param {string} field - Field to update
   * @param {any} value - New value
   */
  const updateTrack = (trackIndex, field, value) => {
    console.log(`ButtonModal: Updating track ${trackIndex}, field ${field}, value:`, value);
    
    const updatedTracks = formData.tracks.map((track, index) =>
      index === trackIndex ? { ...track, [field]: value } : track
    );
    
    const newFormData = { ...formData, tracks: updatedTracks };
    setFormData(newFormData);
    
    console.log('ButtonModal: Updated form data:', newFormData);
    
    // Clear related errors
    if (errors[`track_${trackIndex}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`track_${trackIndex}_${field}`];
      setErrors(newErrors);
    }
  };

  /**
   * Add a new track to the form data
   */
  const addTrack = () => {
    setFormData({
      ...formData,
      tracks: [...formData.tracks, { name: '', url: '', type: AUDIO_TYPES.LOCAL, spotifyId: '', spotifyUri: '' }]
    });
  };

  /**
   * Remove a track from the form data
   * @param {number} trackIndex - Index of track to remove
   */
  const removeTrack = (trackIndex) => {
    if (formData.tracks.length > 1) {
      const updatedTracks = formData.tracks.filter((_, index) => index !== trackIndex);
      setFormData({ ...formData, tracks: updatedTracks });
      
      // Clear related errors
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`track_${trackIndex}_`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  /**
   * Validate form data
   * @returns {boolean} Whether form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate button name
    if (!formData.name.trim()) {
      newErrors.name = 'Button name is required';
    }

    // Validate tracks
    formData.tracks.forEach((track, index) => {
      if (!track.name.trim()) {
        newErrors[`track_${index}_name`] = 'Track name is required';
      }
      
      if (track.type === AUDIO_TYPES.LOCAL && !track.url.trim()) {
        newErrors[`track_${index}_url`] = 'Audio URL is required for local tracks';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  /**
   * Handle backdrop click to close modal
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Handle opening Spotify search for a specific track
   * @param {number} trackIndex - Index of track to search for
   */
  const handleSpotifySearch = (trackIndex) => {
    console.log('ButtonModal: Opening Spotify search for track index:', trackIndex);
    console.log('ButtonModal: Current form data:', formData);
    
    // Pass both the current form data and track index
    onOpenSpotifySearch({
      button: formData,
      trackIndex: trackIndex
    });
  };

  if (!isOpen) return null;

  console.log('ButtonModal: Rendering with formData:', formData);
  console.log('ButtonModal: editingButton:', editingButton);
  console.log('ButtonModal: isEditing:', isEditing);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Sound Button' : 'Add New Sound Button'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Button Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Button Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (errors.name) {
                  const newErrors = { ...errors };
                  delete newErrors.name;
                  setErrors(newErrors);
                }
              }}
              className={`w-full px-3 py-2 bg-gray-700 rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              } focus:border-purple-500 focus:outline-none text-white placeholder-gray-400`}
              placeholder="e.g., Epic Combat Music"
              autoFocus
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Button Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-white"
            >
              <option value={BUTTON_TYPES.SINGLE}>Single Sound</option>
              <option value={BUTTON_TYPES.PLAYLIST}>Playlist</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {formData.type === BUTTON_TYPES.SINGLE 
                ? 'Plays one sound effect or track' 
                : 'Plays multiple tracks in sequence'
              }
            </p>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {BUTTON_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({...formData, color})}
                  className={`w-10 h-10 rounded-full ${color} border-2 transition-all ${
                    formData.color === color 
                      ? 'border-white scale-110' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Tracks */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {formData.type === BUTTON_TYPES.PLAYLIST ? 'Playlist Tracks' : 'Audio File'} *
            </label>
            
            {formData.tracks.map((track, index) => (
              <div key={`track-${index}-${track.spotifyId || track.url || track.name || Date.now()}`} className="border border-gray-600 rounded-lg p-4 mb-3 bg-gray-700/50">
                {/* Track Name */}
                <div className="mb-3">
                  <div className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      value={track.name}
                      onChange={(e) => updateTrack(index, 'name', e.target.value)}
                      className={`flex-1 px-3 py-2 bg-gray-700 rounded-lg border ${
                        errors[`track_${index}_name`] ? 'border-red-500' : 'border-gray-600'
                      } focus:border-purple-500 focus:outline-none text-white placeholder-gray-400`}
                      placeholder="Track name"
                    />
                    
                    {/* Spotify Search Button */}
                    {spotifyConnected && (
                      <button
                        onClick={() => handleSpotifySearch(index)}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-1"
                        title="Search Spotify"
                      >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm">Spotify</span>
                      </button>
                    )}
                    
                    {/* Remove Track Button */}
                    {formData.tracks.length > 1 && (
                      <button
                        onClick={() => removeTrack(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        title="Remove track"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {errors[`track_${index}_name`] && (
                    <p className="text-red-400 text-sm">{errors[`track_${index}_name`]}</p>
                  )}
                </div>
                
                {/* Track URL - Always show but with different behavior based on type */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {track.type === AUDIO_TYPES.SPOTIFY ? 'Spotify URL' : 'Local Audio File URL'}
                  </label>
                  <input
                    type="text"
                    value={track.url || ''}
                    onChange={(e) => updateTrack(index, 'url', e.target.value)}
                    readOnly={track.type === AUDIO_TYPES.SPOTIFY}
                    className={`w-full px-3 py-2 rounded-lg border text-white text-sm ${
                      track.type === AUDIO_TYPES.SPOTIFY 
                        ? 'bg-gray-600 border-gray-600 cursor-not-allowed' 
                        : `bg-gray-700 border-gray-600 focus:border-purple-500 focus:outline-none placeholder-gray-400 ${
                            errors[`track_${index}_url`] ? 'border-red-500' : ''
                          }`
                    }`}
                    placeholder={
                      track.type === AUDIO_TYPES.SPOTIFY 
                        ? 'Spotify URL will appear here'
                        : 'Local audio file URL or path'
                    }
                  />
                  {track.type !== AUDIO_TYPES.SPOTIFY && errors[`track_${index}_url`] && (
                    <p className="text-red-400 text-sm mt-1">{errors[`track_${index}_url`]}</p>
                  )}
                </div>
                
                {/* Spotify Track Info */}
                {track.type === AUDIO_TYPES.SPOTIFY && (
                  <div className="flex items-center gap-2 p-3 bg-green-900/30 border border-green-700 rounded-lg mt-2">
                    <ExternalLink className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Connected to Spotify</span>
                    {track.url && (
                      <a 
                        href={track.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-green-300 hover:underline ml-auto"
                      >
                        View on Spotify
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Track Button (for playlists) */}
            {formData.type === BUTTON_TYPES.PLAYLIST && (
              <button
                onClick={addTrack}
                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg transition-colors text-gray-300 hover:text-white flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Track
              </button>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            {isEditing ? 'Save Changes' : 'Create Button'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonModal;