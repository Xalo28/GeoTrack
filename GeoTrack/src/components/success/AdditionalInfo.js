import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AdditionalInfo = ({ dir, cel }) => {
  return (
    <View style={styles.additionalInfo}>
      <Text style={styles.additionalInfoTitle}>DETALLES ADICIONALES</Text>
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <MaterialIcons name="access-time" size={20} color="#5CE1E6" />
          <Text style={styles.detailLabel}>Hora de registro:</Text>
          <Text style={styles.detailValue}>
            {new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="location-on" size={20} color="#5CE1E6" />
          <Text style={styles.detailLabel}>Dirección:</Text>
          <Text style={styles.detailValue}>{dir}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="phone" size={20} color="#5CE1E6" />
          <Text style={styles.detailLabel}>Teléfono:</Text>
          <Text style={styles.detailValue}>{cel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  additionalInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  additionalInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#a0a0c0',
    marginLeft: 8,
    marginRight: 10,
    width: 100,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
};

export default AdditionalInfo;