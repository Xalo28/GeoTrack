import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

const SecurityNote = () => {
  return (
    <View style={styles.securityNote}>
      <MaterialIcons name="verified-user" size={16} color="#5CE1E6" />
      <Text style={styles.securityText}>Autenticación 100% segura con Auth0</Text>
    </View>
  );
};

export default SecurityNote;