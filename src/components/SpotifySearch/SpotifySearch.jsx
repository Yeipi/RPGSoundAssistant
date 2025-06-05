import React, { useEffect, useRef } from 'react';
import { Search, X, Music, ExternalLink, Loader } from 'lucide-react';
import { SEARCH_TYPES } from '../../utils/constants';

/**
 * Spotify search modal component with automatic search
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.searchQuery - Current search query
 * @param {string} props.searchType - Current search type ('track' or 'playlist')
 * @param {Array} props.searchResults - Array of search results
 * @param {boolean} props.isLoading - Whether search is in progress
 * @param {Function} props.onSearch - Callback to perform search
 * @param {Function} props.onQueryChange - Callback when search query changes
 * @param {Function} props.onTypeChange - Callback when search type changes
 * @param {Function} props.onSelectTrack - Callback when a track/playlist is selected
 * @param {Function} props.onClose - Callback to close the modal
 */
const SpotifySearch = ({
  isOpen,
  searchQuery,
  searchType,
  searchResults,
  isLoading = false,
  onSearch,
  onQueryChange,
  onTypeChange,
  onSelectTrack,
  onClose
}) => {
  const searchTimeoutRef = useRef(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Auto-search effect with debouncing
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only search if we have a query and the modal is open
    if (searchQuery.trim() && isOpen) {
      // Set up new timeout for debounced search
      searchTimeoutRef.current = setTimeout(() => {
        console.log('Auto-searching for:', searchQuery);
        onSearch();
      }, 500); // Wait 500ms after user stops typing
    }

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchType, isOpen]); // Removed onSearch from dependencies to prevent loop

  /**
   * Handle search form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear timeout and search immediately
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onSearch();
  };

  /**
   * Handle search query change
   */
  const handleQueryChange = (value) => {
    onQueryChange(value);
    // The useEffect above will handle the debounced search
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
   * Get image URL from Spotify item
   */
  const getImageUrl = (item) => {
    if (searchType === SEARCH_TYPES.TRACK) {
      return item.album?.images?.[0]?.url;
    } else {
      return item.images?.[0]?.url;
    }
  };

  /**
   * Get subtitle text for search result
   */
  const getSubtitle = (item) => {
    if (searchType === SEARCH_TYPES.TRACK) {
      return item.artists?.[0]?.name || 'Unknown Artist';
    } else {
      return `${item.tracks?.total || 0} tracks`;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <ExternalLink className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Search Spotify</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onTypeChange(SEARCH_TYPES.TRACK)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              searchType === SEARCH_TYPES.TRACK 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
            }`}
          >
            Tracks
          </button>
          <button
            onClick={() => onTypeChange(SEARCH_TYPES.PLAYLIST)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              searchType === SEARCH_TYPES.PLAYLIST 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
            }`}
          >
            Playlists
          </button>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-white placeholder-gray-400"
              placeholder={`Search for ${searchType === SEARCH_TYPES.TRACK ? 'songs, artists, albums' : 'playlists'}... (auto-search enabled)`}
              autoFocus
            />
            <Music className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={!searchQuery.trim() || isLoading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium text-white flex items-center gap-2"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Search
          </button>
        </form>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-400">
                <Loader className="w-6 h-6 animate-spin" />
                <span>Searching Spotify...</span>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors group"
                  onClick={() => onSelectTrack(item)}
                >
                  {/* Album/Playlist Cover */}
                  <div className="w-12 h-12 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                    {getImageUrl(item) ? (
                      <img
                        src={getImageUrl(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Track/Playlist Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {getSubtitle(item)}
                    </p>
                    {item.explicit && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-600 text-xs rounded text-gray-300">
                        Explicit
                      </span>
                    )}
                  </div>
                  
                  {/* External Link Icon */}
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : searchQuery && !isLoading ? (
            <div className="text-center py-12 text-gray-400">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No {searchType === SEARCH_TYPES.TRACK ? 'tracks' : 'playlists'} found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Search for {searchType === SEARCH_TYPES.TRACK ? 'tracks' : 'playlists'} on Spotify</p>
              <p className="text-sm mt-2">Start typing to search automatically</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotifySearch;