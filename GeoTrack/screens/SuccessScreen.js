import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOrders } from '../context/OrdersContext';

import ScanHeader from '../components/ScanHeader';
import ScanControls from '../components/ScanControls';
import SuccessIcon from '../components/SuccessIcon';

const SuccessScreen = ({ navigation, route }) => {
  const { addOrder } = useOrders();
  
  // Manejo seguro de route.params
  const scannedCode = route?.params?.scannedCode || 'PED-' + Math.floor(100000 + Math.random() * 900000);

  // Estructura de datos que coincide con lo que espera RecentOrders
  const orderData = {
    id: Date.now().toString(), // ID único
    cliente: "Maria García",
    numeroPedido: scannedCode, // Usado en: Código: {order.numeroPedido}
    estado: 'Pendiente', // Usado en el badge de estado
    informacionContacto: {
      direccion: 'Av. Los Páñones 123, San Juan de Lurigancho', // Usado en: {order.informacionContacto.direccion}
      telefono: '+51 987 654 321'
    },
    // Propiedades adicionales que podrían ser usadas en el modal de detalles
    celular: "+51 987 654 321",
    codigo: scannedCode,
    productos: [
      'Logros Del 195 13',
      'Mesas Instituciones', 
      'Funda protectora'
    ]
  };

  const handleAccept = () => {
    addOrder(orderData);
    navigation.navigate('Pedidos');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScanHeader 
        navigation={navigation}
        phaseTitle="PEDIDO REGISTRADO"
        instruction=""
        showInstruction={false}
      />
      
      <View style={styles.content}>
        <SuccessIcon size={120} checkmarkSize={60} />
        
        <Text style={styles.successTitle}>INGRESO DE PEDIDO EXITOSO</Text>
        
        <View style={styles.orderInfo}>
          <Text style={styles.orderText}>Pedido registrado correctamente</Text>
          <View style={styles.orderDetails}>
            <Text style={styles.orderCode}>Cliente: {orderData.cliente}</Text>
            <Text style={styles.orderCode}>Dirección: {orderData.informacionContacto.direccion}</Text>
            <Text style={styles.orderCode}>Celular: {orderData.celular}</Text>
            <Text style={styles.orderCode}>Código: {orderData.numeroPedido}</Text>
          </View>
        </View>

        <ScanControls 
          isScanning={false}
          onStartScanning={handleAccept}
          buttonText="ACEPTAR"
          buttonStyle={styles.acceptButton}
          textStyle={styles.acceptButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  orderInfo: {
    backgroundColor: '#f8f9fa',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 50,
    borderWidth: 2,
    borderColor: '#000000',
    minWidth: 300,
  },
  orderText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  orderDetails: {
    width: '100%',
  },
  orderCode: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    opacity: 0.8,
    marginBottom: 8,
  },
  acceptButton: {
    backgroundColor: '#27ae60',
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  acceptButtonText: {
    color: 'white',
  },
});

export default SuccessScreen;