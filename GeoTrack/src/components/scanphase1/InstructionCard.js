import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InstructionCard = ({ onInfoPress }) => {
  const showQRInfo = () => {
    Alert.alert(
      'Información del QR',
      'El código QR debe tener exactamente esta estructura JSON:\n\n' +
      '{\n' +
      '  "NOMBRE": "Nombre del cliente",\n' +
      '  "CEL": "Número de teléfono",\n' +
      '  "DIR": "Dirección completa",\n' +
      '  "DISTRITO": "Distrito de entrega",\n' +
      '  "PROD": "Producto1,Producto2,Producto3"\n' +
      '}',
      [{ text: 'ENTENDIDO' }]
    );
  };

  return (
    <View style={instructionStyles.card}>
      <MaterialIcons name="qr-code-scanner" size={50} color="#5CE1E6" />
      <Text style={instructionStyles.title}>
        Escanea el Código del Pedido para registrar
      </Text>
      <Text style={instructionStyles.subtitle}>
        Asegúrate de que el código tenga la estructura JSON correcta
      </Text>
      <View style={instructionStyles.qrStructure}>
        <Text style={instructionStyles.structureText}>
          Estructura requerida: {"\n"}
          <Text style={instructionStyles.keys}>
            {"{"}"NOMBRE": "...", "CEL": "...", "DIR": "...", "DISTRITO": "...", "PROD": "..."
            {"}"}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={instructionStyles.infoButton}
        onPress={onInfoPress || showQRInfo}
      >
        <MaterialIcons name="info-outline" size={20} color="#5CE1E6" />
        <Text style={instructionStyles.infoButtonText}>Más información</Text>
      </TouchableOpacity>
    </View>
  );
};

const instructionStyles = {
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.2)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 15,
  },
  qrStructure: {
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.3)',
    width: '100%',
  },
  structureText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
  },
  keys: {
    color: '#5CE1E6',
    fontWeight: 'bold',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(92, 225, 230, 0.15)',
    borderRadius: 8,
  },
  infoButtonText: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 5,
    fontWeight: '500',
  },
};

export default InstructionCard;