import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InfoCard = ({ orderNumber, nombre, cel, dir, distrito, productosArray }) => {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoSection}>
        <Text style={styles.label}>Número de Pedido:</Text>
        <Text style={styles.value}>{orderNumber}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.value}>{nombre}</Text>
      </View>

      <View style={styles.divider} />
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{cel}</Text>
      </View>

      <View style={styles.divider} />
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.value}>{dir}</Text>
      </View>

      <View style={styles.divider} />
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Distrito:</Text>
        <Text style={styles.value}>{distrito}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Productos:</Text>
        <View style={styles.productsContainer}>
          {productosArray.map((producto, index) => (
            <View key={index} style={styles.productoItem}>
              <MaterialIcons name="check-circle" size={16} color="#4ECB71" />
              <Text style={styles.productoText}>{producto}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = {
  infoCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoSection: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  productsContainer: {
    marginTop: 5,
  },
  productoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productoText: {
    fontSize: 14,
    color: '#5CE1E6',
    marginLeft: 8,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 10,
  },
};

export default InfoCard;