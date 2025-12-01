import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const DistrictCard = ({ district, pendingCount, deliveredCount, driverName, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.districtTitle}>{district.toUpperCase()}</Text>
      
      <View style={styles.contentContainer}>
        {/* Imagen del camión */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/images/truck.png')} 
            style={styles.truckImage}
            resizeMode="contain"
          />
          <Text style={styles.driverName}>{driverName}</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>PEDIDOS ENTREGADOS: {deliveredCount}</Text>
          <Text style={styles.statText}>PEDIDOS PENDIENTES: {pendingCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#5CE1E6', // Color cyan de tu diseño
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  districtTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  truckImage: {
    width: 60,
    height: 40,
  },
  driverName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
});

export default DistrictCard;