import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DateDisplay = () => {
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  return (
    <View style={styles.dateContainer}>
      <MaterialIcons name="calendar-today" size={20} color="#5CE1E6" />
      <Text style={styles.dateText}>{formattedDate}</Text>
    </View>
  );
};

const styles = {
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
};

export default DateDisplay;