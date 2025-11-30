import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Header from '../components/Header';
import FormInputWithIcon from '../components/FormInputWithIcon';
import DistrictSelector from '../components/DistrictSelector';
import BottomBar from '../components/BottomBar';
import { useOrders } from '../context/OrdersContext';

const ManualOrderScreen = ({ navigation }) => {
  const { addOrder } = useOrders();
  
  const [formData, setFormData] = useState({
    orderId: '',
    clientName: '',
    phone: '',
    district: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.clientName.trim()) { newErrors.clientName = 'Requerido'; isValid = false; }
    if (!formData.phone.trim()) { newErrors.phone = 'Requerido'; isValid = false; }
    if (!formData.district.trim()) { newErrors.district = 'Requerido'; isValid = false; }
    if (!formData.address.trim()) { newErrors.address = 'Requerido'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleAccept = () => {
    if (validateForm()) {
      // 1. Crear objeto de pedido
      const newOrder = {
        numeroPedido: formData.orderId || `MAN-${Date.now().toString().slice(-4)}`,
        cliente: formData.clientName,
        distrito: formData.district,
        informacionContacto: {
          telefono: formData.phone,
          direccion: formData.address
        },
        productos: ['Entrega Manual', 'Paquete Estándar']
      };

      // 2. Guardar en Contexto
      addOrder(newOrder);

      // 3. Feedback y Navegación
      Alert.alert("Éxito", "Pedido registrado correctamente", [
        { text: "OK", onPress: () => navigation.navigate('Pedidos') }
      ]);
    } else {
      Alert.alert("Atención", "Por favor completa los campos marcados");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header navigation={navigation} title="NUEVO PEDIDO" showBack={true} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Ingrese datos del pedido</Text>
          
          <View style={styles.formContainer}>
            <FormInputWithIcon
              label="ID Pedido (Opcional)"
              value={formData.orderId}
              onChangeText={(v) => handleInputChange('orderId', v)}
              placeholder="Ej: PED-001"
              iconName="barcode-outline"
            />
            
            <FormInputWithIcon
              label="Cliente *"
              value={formData.clientName}
              onChangeText={(v) => handleInputChange('clientName', v)}
              placeholder="Nombre completo"
              iconName="person-outline"
              error={errors.clientName}
            />
            
            <FormInputWithIcon
              label="Teléfono *"
              value={formData.phone}
              onChangeText={(v) => handleInputChange('phone', v)}
              placeholder="Ej: 999 999 999"
              iconName="call-outline"
              keyboardType="phone-pad"
              error={errors.phone}
            />
            
            <DistrictSelector
              label="Distrito *"
              value={formData.district}
              onSelect={(v) => handleInputChange('district', v)}
              error={errors.district}
            />
            
            <FormInputWithIcon
              label="Dirección *"
              value={formData.address}
              onChangeText={(v) => handleInputChange('address', v)}
              placeholder="Av. Principal 123"
              iconName="location-outline"
              error={errors.address}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>CANCELAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]} 
              onPress={handleAccept}
            >
              <Text style={styles.acceptText}>GUARDAR</Text>
            </TouchableOpacity>
          </View>
          
          {/* Espacio extra para el teclado */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomBar 
        onScanPress={() => navigation.navigate('ScanPhase1')}
        onAddPress={() => {}} // Ya estamos aquí
        onMenuPress={() => navigation.navigate('Menu')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 20 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: { marginBottom: 20 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 0.48,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: { backgroundColor: '#FFEDED', borderWidth: 1, borderColor: '#FF4444' },
  acceptButton: { backgroundColor: '#5CE1E6', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  cancelText: { color: '#FF4444', fontWeight: 'bold' },
  acceptText: { color: '#FFF', fontWeight: 'bold' },
});

export default ManualOrderScreen;