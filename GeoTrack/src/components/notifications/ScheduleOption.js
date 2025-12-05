import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ScheduleOption = ({ title, value, isSelected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.scheduleOption, isSelected && styles.scheduleOptionSelected]}
    onPress={() => onSelect(value)}
    activeOpacity={0.7}
  >
    <View style={styles.scheduleRadio}>
      <View style={[styles.scheduleRadioInner, isSelected && styles.scheduleRadioSelected]} />
    </View>
    <Text style={[styles.scheduleText, isSelected && styles.scheduleTextSelected]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = {
  scheduleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  scheduleOptionSelected: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  scheduleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#a0a0c0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  scheduleRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  scheduleRadioSelected: {
    backgroundColor: '#5CE1E6',
  },
  scheduleText: {
    fontSize: 14,
    color: '#a0a0c0',
    flex: 1,
  },
  scheduleTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
};

export default ScheduleOption;