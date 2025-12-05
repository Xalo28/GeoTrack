import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SettingsOption = ({
  icon,
  label,
  value,
  valueColor = '#a0a0c0',
  onPress,
  isFirst = false,
  isLast = false,
  showChevron = true,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.optionItem,
        isFirst && styles.optionItemFirst,
        isLast && styles.optionItemLast
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionContent}>
        {icon && (
          <MaterialIcons name={icon} size={24} color="#5CE1E6" />
        )}
        <Text style={styles.optionText}>{label}</Text>
      </View>
      <View style={styles.optionRight}>
        {value && (
          <Text style={[styles.optionValue, { color: valueColor }]}>
            {value}
          </Text>
        )}
        {showChevron && (
          <MaterialIcons name="chevron-right" size={20} color="#a0a0c0" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  optionItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 12,
    marginRight: 8,
  },
};

export default SettingsOption;