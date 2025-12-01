import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOrders } from '../context/OrdersContext';

import ScanHeader from '../components/ScanHeader';
import ScanControls from '../components/ScanControls';
import SuccessIcon from '../components/SuccessIcon';

const SuccessScreen = ({ navigation, route }) => {
  const { addOrder } = useOrders();

  const scannedData = route?.params?.scannedData;

  if (!scannedData) {
    Alert.alert("ERROR", "QR inválido — faltan datos requeridos");
    navigation.goBack();
    return null;
  }

  const newOrderData = {
    numeroPedido: Date.now().toString(),
    cliente: scannedData.NOMBRE,
    informacionContacto: {
      direccion: scannedData.DIR,
      telefono: scannedData.CEL,
    },
    distrito: scannedData.DISTRITO,
    productos: scannedData.PROD?.split(",") || []
  };

  const handleAccept = () => {
    addOrder(newOrderData);
    navigation.navigate('Home');
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

      {/* 👇 👇 👇  AQUI EL FIX  👇 👇 👇 */}
      <ScrollView contentContainerStyle={styles.scrollArea}> 

        <View style={styles.content}>
          <SuccessIcon size={120} checkmarkSize={60} />
          
          <Text style={styles.successTitle}>PEDIDO REGISTRADO</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{newOrderData.cliente}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Celular:</Text>
            <Text style={styles.value}>{newOrderData.informacionContacto.telefono}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Dirección:</Text>
            <Text style={styles.value}>{newOrderData.informacionContacto.direccion}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Distrito:</Text>
            <Text style={styles.value}>{newOrderData.distrito}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Productos:</Text>
            {newOrderData.productos.map((p, index) => (
              <Text key={index} style={styles.value}>• {p}</Text>
            ))}
          </View>

          <ScanControls 
            isScanning={false}
            onStartScanning={handleAccept}
            buttonText="FINALIZAR Y GUARDAR"
            buttonStyle={styles.finishButton}
          />
        </View>

      </ScrollView>
      {/* 👆 👆 👆 SCROLLVIEW 👆 👆 👆 */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  scrollArea: {
    padding: 20,
    paddingBottom: 40,
  },

  content: { 
    alignItems: 'center',
    width: '100%'
  },

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
    marginBottom: 20,
  },

  label: { fontSize: 14, color: '#666', marginTop: 10 },
  value: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 10 },
  finishButton: { 
    backgroundColor: '#5CE1E6',
    marginTop: 30, 
    width: '100%' 
  },
});

export default SuccessScreen;
