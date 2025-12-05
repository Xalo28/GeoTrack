import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

const FeatureItem = ({ icon, text }) => {
  return (
    <View style={styles.featureItem}>
      <MaterialIcons name={icon} size={24} color="#5CE1E6" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
};

export default FeatureItem;