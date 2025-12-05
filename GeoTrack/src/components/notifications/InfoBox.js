import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InfoBox = () => (
  <View style={styles.infoContainer}>
    <View style={styles.infoHeader}>
      <MaterialIcons name="info" size={18} color="#5CE1E6" />
      <Text style={styles.infoTitle}>Información importante</Text>
    </View>
    <Text style={styles.infoText}>
      Recibirás notificaciones sobre nuevos pedidos asignados, cambios en tus rutas activas, 
      recordatorios de entrega y actualizaciones importantes del sistema.
    </Text>
    <Text style={styles.infoNote}>
      Las notificaciones SMS solo se enviarán para alertas consideradas urgentes por el sistema.
    </Text>
  </View>
);

const styles = {
  infoContainer: {
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#5CE1E6',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#5CE1E6',
    lineHeight: 18,
    marginBottom: 8,
  },
  infoNote: {
    fontSize: 11,
    color: '#5CE1E6',
    fontStyle: 'italic',
  },
};

export default InfoBox;