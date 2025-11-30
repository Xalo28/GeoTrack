import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOrders } from '../context/OrdersContext';

import ScanHeader from '../components/ScanHeader';
import ScanControls from '../components/ScanControls';
import SuccessIcon from '../components/SuccessIcon';

const SuccessScreen = ({ navigation, route }) => {
  const { addOrder } = useOrders();
  
  // Datos simulados o recibidos del escáner
  const scannedData = route?.params?.scannedData || 'QR-UNKNOWN';
  
  const newOrderData = {
    numeroPedido: scannedData,
    cliente: "Cliente Escaneado",
    informacionContacto: {
      direccion: 'Dirección detectada por GPS',
      telefono: '999-888-777'
    },
    distrito: 'San Isidro',
    productos: ['Caja Registrada', 'Documentos']
  };

  const handleAccept = () => {
    // 1. Guardar el pedido escaneado en el estado global
    addOrder(newOrderData);
    
    // 2. Ir a la lista de pedidos
    navigation.navigate('Pedidos');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScanHeader 
        navigation={navigation}
        phaseTitle="ÉXITO"
        instruction="Código procesado correctamente"
        showInstruction={true}
      />
      
      <View style={styles.content}>
        <SuccessIcon size={120} checkmarkSize={60} />
        
        <Text style={styles.successTitle}>PEDIDO REGISTRADO</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.label}>Código Detectado:</Text>
          <Text style={styles.value}>{scannedData}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{newOrderData.cliente}</Text>
        </View>

        <View style={{ flex: 1 }} />

        <ScanControls 
          isScanning={false}
          onStartScanning={handleAccept}
          buttonText="FINALIZAR Y GUARDAR"
          buttonStyle={styles.finishButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 30, alignItems: 'center' },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginVertical: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  label: { fontSize: 14, color: '#666', marginTop: 10 },
  value: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 10 },
  finishButton: { backgroundColor: '#5CE1E6', marginTop: 20, width: '100%' },
});

export default SuccessScreen;