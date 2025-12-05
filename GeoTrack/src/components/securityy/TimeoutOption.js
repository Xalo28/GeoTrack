import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const TimeoutOption = ({ value, label, isSelected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.timeoutOption, isSelected && styles.timeoutOptionSelected]}
    onPress={() => onSelect(value)}
    activeOpacity={0.7}
  >
    <View style={styles.timeoutRadio}>
      <View style={[styles.timeoutRadioInner, isSelected && styles.timeoutRadioSelected]} />
    </View>
    <Text style={[styles.timeoutText, isSelected && styles.timeoutTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = {
  timeoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  timeoutOptionSelected: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  timeoutRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#a0a0c0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  timeoutRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  timeoutRadioSelected: {
    backgroundColor: '#5CE1E6',
  },
  timeoutText: {
    fontSize: 14,
    color: '#a0a0c0',
    flex: 1,
  },
  timeoutTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
};
export default TimeoutOption;