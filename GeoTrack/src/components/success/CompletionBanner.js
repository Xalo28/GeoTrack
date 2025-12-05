import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CompletionBanner = () => {
  return (
    <View style={styles.completionContainer}>
      <MaterialIcons 
        name="verified" 
        size={30} 
        color="#4ECB71" 
        style={styles.verifiedIcon}
      />
      <Text style={styles.completionText}>
        ¡PROCESO COMPLETADO CON ÉXITO!
      </Text>
    </View>
  );
};

const styles = {
  completionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 203, 113, 0.2)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 203, 113, 0.4)',
  },
  verifiedIcon: {
    marginRight: 10,
  },
  completionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4ECB71',
    letterSpacing: 1,
    flex: 1,
  },
};

export default CompletionBanner;