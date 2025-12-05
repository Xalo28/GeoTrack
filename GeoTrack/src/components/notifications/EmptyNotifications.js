import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EmptyNotifications = () => (
  <View style={styles.emptyState}>
    <MaterialIcons name="notifications-off" size={60} color="rgba(255, 255, 255, 0.2)" />
    <Text style={styles.emptyTitle}>No hay notificaciones</Text>
    <Text style={styles.emptySubtitle}>
      Cuando tengas nuevas alertas, aparecerán aquí
    </Text>
  </View>
);

const styles = {
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
};

export default EmptyNotifications;