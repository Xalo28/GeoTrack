import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

export const ProfileField = ({ icon, label, value, isLast = false }) => (
  <View style={[styles.fieldContainer, isLast && styles.fieldLast]}>
    <View style={styles.fieldIcon}>
      <MaterialIcons name={icon} size={22} color="#5CE1E6" />
    </View>
    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  </View>
);
export default ProfileField;