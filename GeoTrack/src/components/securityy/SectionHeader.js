import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const SectionHeader = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    <MaterialIcons name={icon} size={20} color="#5CE1E6" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const styles = {
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(92, 225, 230, 0.3)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
};
export default SectionHeader;