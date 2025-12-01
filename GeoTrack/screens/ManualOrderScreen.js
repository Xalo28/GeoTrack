import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView,
  TouchableOpacity,
  Alert 
} from 'react-native';
import Header from '../components/Header';
import FormInputWithIcon from '../components/FormInputWithIcon';
import DistrictSelector from '../components/DistrictSelector';
import BottomBar from '../components/BottomBar';
import { useOrders } from '../context/OrdersContext';
import OSMAddressAutocomplete from '../components/OSMAddressAutocomplete';

const ManualOrderScreen = ({ navigation }) => {
  const { addOrder } = useOrders();
  
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    district: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

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

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre es requerido';
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
      isValid = false;
    }
    if (!formData.district.trim()) {
      newErrors.district = 'El distrito es requerido';
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancelar",
      "¿Estás seguro de que quieres cancelar el ingreso del pedido?",
      [
        { text: "NO", style: "cancel" },
        { text: "SÍ", onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleAccept = () => {
    if (validateForm()) {
      // Generar un ID aleatorio tipo PED-123456
      const randomId = `PED-${Math.floor(Math.random() * 1000000)}`;

      const newOrder = {
        cliente: formData.clientName.trim(),
        numeroPedido: randomId,
        informacionContacto: {
          telefono: formData.phone.trim(),
          direccion: formData.address.trim()
        },
        distrito: formData.district.trim()
      };

      try {
        addOrder(newOrder);
        Alert.alert("Éxito", `Pedido ${newOrder.numeroPedido} registrado`, [
          { text: "OK", onPress: () => navigation.navigate('Home') } 
        ]);
        setFormData({ clientName: '', phone: '', district: '', address: '' });
      } catch (error) {
        console.error('Error adding order:', error);
        Alert.alert(
          "Error",
          "No se pudo registrar el pedido. Por favor intente nuevamente."
        );
      }
    } else {
      Alert.alert(
        "Formulario incompleto",
        "Por favor complete todos los campos requeridos."
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "CANCELAR", style: "cancel" },
        { text: "SÍ", onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Header 
        navigation={navigation}
        onBackPress={handleLogout}
        title="INICIO"
        subtitle="Juanito Lopez"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>INGRESE PEDIDO MANUALMENTE</Text>
        
        <View style={styles.formContainer}>
          {/* Nombre del cliente */}
          <FormInputWithIcon
            label="Nombre del cliente"
            value={formData.clientName}
            onChangeText={(value) => handleInputChange('clientName', value)}
            placeholder="Ingrese el nombre completo"
            iconName="person"
            error={errors.clientName}
            autoCapitalize="words"
          />
          
          {/* Teléfono */}
          <FormInputWithIcon
            label="Teléfono"
            value={formData.phone}
            onChangeText={(value) => {
              const cleanValue = value.replace(/[^0-9]/g, '');
              if (cleanValue.length <= 9) handleInputChange('phone', cleanValue);
            }}
            placeholder="Ej: 987654321"
            iconName="call"
            error={errors.phone}
            keyboardType="numeric"
          />
          
          {/* Distrito */}
          <DistrictSelector
            label="Distrito"
            value={formData.district}
            onSelect={(value) => handleInputChange('district', value)}
            error={errors.district}
          />
          
          {/* Dirección con OSM Autocomplete */}
          <OSMAddressAutocomplete
            label="Dirección"
            value={formData.address}
            onChangeText={(value) => {
              console.log('onChangeText llamado con:', value);
              handleInputChange('address', value);
            }}
            placeholder="Selecciona o busca una dirección"
            error={errors.address}
            onSelect={(addressData) => {
              console.log('onSelect llamado con:', addressData);
              // IMPORTANTE: Actualizar el estado con la dirección
              handleInputChange('address', addressData.address);
              
              // OPCIONAL: Autocompletar el distrito si está disponible
              if (addressData.details && addressData.details.suburb) {
                handleInputChange('district', addressData.details.suburb);
              }
            }}
            countryCode="pe"
            city="Lima"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>CANCELAR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.acceptButton} 
            onPress={handleAccept}
            activeOpacity={0.7}
          >
            <Text style={styles.acceptButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomBar 
        onScanPress={() => console.log('Scan pressed')}
        onAddPress={() => console.log('Add pressed')}
        onMenuPress={() => console.log('Menu pressed')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center', marginTop: 20, marginBottom: 30 },
  formContainer: { marginBottom: 30 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, paddingHorizontal: 10 },
  cancelButton: { backgroundColor: '#FF4444', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6, flex: 0.45, alignItems: 'center' },
  cancelButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  acceptButton: { backgroundColor: '#4CAF50', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6, flex: 0.45, alignItems: 'center' },
  acceptButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});

export default ManualOrderScreen;