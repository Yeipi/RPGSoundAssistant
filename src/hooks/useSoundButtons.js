import { useState } from 'react';
import { DEFAULT_BUTTONS } from '../utils/constants';

/**
 * Custom hook for managing sound buttons state and operations
 * @returns {Object} Sound buttons state and management functions
 */
export const useSoundButtons = () => {
  const [soundButtons, setSoundButtons] = useState(DEFAULT_BUTTONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingButton, setEditingButton] = useState(null);

  /**
   * Add a new sound button
   * @param {Object} newButton - New button configuration
   */
  const addSoundButton = (newButton) => {
    const id = Math.max(...soundButtons.map(b => b.id), 0) + 1;
    setSoundButtons(prevButtons => [...prevButtons, { ...newButton, id }]);
    setShowAddModal(false);
  };

  /**
   * Update an existing sound button
   * @param {Object} updatedButton - Updated button configuration
   */
  const editSoundButton = (updatedButton) => {
    setSoundButtons(prevButtons => 
      prevButtons.map(button => 
        button.id === updatedButton.id ? updatedButton : button
      )
    );
    setShowEditModal(false);
    setEditingButton(null);
  };

  /**
   * Remove a sound button
   * @param {number} id - Button ID to remove
   */
  const deleteSoundButton = (id) => {
    setSoundButtons(prevButtons => prevButtons.filter(button => button.id !== id));
  };

  /**
   * Open edit modal for a specific button
   * @param {Object} button - Button to edit
   */
  const openEditModal = (button) => {
    setEditingButton({ ...button });
    setShowEditModal(true);
  };

  /**
   * Close all modals and reset editing state
   */
  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingButton(null);
  };

  return {
    // State
    soundButtons,
    showAddModal,
    showEditModal,
    editingButton,
    
    // Actions
    addSoundButton,
    editSoundButton,
    deleteSoundButton,
    openEditModal,
    closeModals,
    
    // Modal controls
    setShowAddModal,
    setShowEditModal,
    setEditingButton
  };
};