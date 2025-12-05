import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

export const InfoCard = ({ nombre, cel, dir, distrito }) => {
  return (
    <>
      <View style={styles.infoCard}>
        <MaterialIcons name="inventory" size={20} color="#5CE1E6" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Cliente:</Text>
          <Text style={styles.infoValue}>{nombre}</Text>
        </View>
      </View>

      <View style={styles.additionalInfoContainer}>
        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={16} color="#a0a0c0" />
          <Text style={styles.infoLabelSmall}>Teléfono:</Text>
          <Text style={styles.infoValueSmall}>{cel}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={16} color="#a0a0c0" />
          <Text style={styles.infoLabelSmall}>Dirección:</Text>
          <Text style={styles.infoValueSmall}>{dir}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="place" size={16} color="#a0a0c0" />
          <Text style={styles.infoLabelSmall}>Distrito:</Text>
          <Text style={styles.infoValueSmall}>{distrito}</Text>
        </View>
      </View>
    </>
  );
};
export default InfoCard;