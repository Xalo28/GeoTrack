import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

export const StatCard = ({ icon, label, value, color = '#5CE1E6' }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={[`${color}20`, `${color}10`]}
      style={styles.statGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  </View>
);
export default StatCard;