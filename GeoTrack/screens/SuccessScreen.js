import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Componentes reutilizados
import ScanHeader from '../components/ScanHeader';
import ScanControls from '../components/ScanControls';
import SuccessIcon from '../components/SuccessIcon';

const SuccessScreen = ({ navigation }) => {
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
            <Text style={styles.orderCode}>Cliente: Juan Pérez</Text>
            <Text style={styles.orderCode}>Direccion: Los Robles 123 - Jesus Maria</Text>
            <Text style={styles.orderCode}>Celular: 987654321</Text>
            <Text style={styles.orderCode}>Código: PED-123456</Text>
          </View>
        </View>

        <ScanControls 
          isScanning={false}
          onStartScanning={() => navigation.navigate('Home')}
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