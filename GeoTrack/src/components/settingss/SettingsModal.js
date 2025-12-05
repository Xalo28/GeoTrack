import React from 'react';
import { Animated, View } from 'react-native';

const SettingsModal = ({ 
  isVisible, 
  modalScale, 
  modalOpacity, 
  children, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
      {children}
    </Animated.View>
  );
};

const styles = {
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
};

export default SettingsModal;