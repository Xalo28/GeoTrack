import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

export const DateDisplay = () => {
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  return (
    <View style={styles.dateContainer}>
      <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
      <Text style={styles.dateText}>{formattedDate}</Text>
    </View>
  );
};
export default DateDisplay;