import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

export const ActionButtons = ({ 
  onCancel, 
  onAccept, 
  isSaving, 
  isEditMode,
  disabled = false 
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity 
        style={[styles.actionButton, styles.cancelButton]} 
        onPress={onCancel}
        disabled={isSaving || disabled}
      >
        <Text style={styles.cancelText}>CANCELAR</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.acceptButton, (isSaving || disabled) && styles.disabledButton]} 
        onPress={onAccept}
        disabled={isSaving || disabled}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.acceptText}>{isEditMode ? 'ACTUALIZAR' : 'GUARDAR'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20, 
    gap: 15 
  },
  actionButton: { 
    flex: 1, 
    paddingVertical: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: 52 
  },
  cancelButton: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 68, 68, 0.4)' 
  },
  acceptButton: { 
    backgroundColor: 'rgba(92, 225, 230, 0.2)', 
    borderWidth: 1, 
    borderColor: 'rgba(92, 225, 230, 0.4)' 
  },
  disabledButton: { 
    opacity: 0.6 
  },
  cancelText: { 
    color: '#FF4444', 
    fontWeight: 'bold', 
    fontSize: 16, 
    letterSpacing: 0.5 
  },
  acceptText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16, 
    letterSpacing: 0.5 
  },
});
export default ActionButtons; 
