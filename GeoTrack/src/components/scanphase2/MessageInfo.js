import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

export const MessageInfo = () => {
  return (
    <View style={styles.messageContainer}>
      <MaterialIcons name="info" size={18} color="#5CE1E6" />
      <Text style={styles.messageText}>
        El proceso se completará automáticamente
      </Text>
    </View>
  );
};
export default MessageInfo;