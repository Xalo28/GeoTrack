import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ModalOption = ({ icon, label, isSelected, onSelect, iconColor = '#5CE1E6' }) => (
  <TouchableOpacity 
    style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <View style={styles.modalOptionContent}>
      {icon && (
        <MaterialIcons name={icon} size={24} color={isSelected ? '#5CE1E6' : iconColor} />
      )}
      <Text style={[styles.modalOptionLabel, isSelected && styles.modalOptionLabelSelected]}>
        {label}
      </Text>
    </View>
    {isSelected && (
      <MaterialIcons name="check-circle" size={24} color="#5CE1E6" />
    )}
  </TouchableOpacity>
);

const styles = {
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalOptionSelected: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  modalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalOptionLabel: {
    fontSize: 16,
    color: '#a0a0c0',
    marginLeft: 12,
    flex: 1,
  },
  modalOptionLabelSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
};

export default ModalOption;