import React, { useState, useEffect } from 'react';
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

const ManualOrderScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    orderId: '',
    clientName: '',
    phone: '',
    district: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  // Efecto para limpiar errores cuando el usuario empiece a escribir
  useEffect(() => {
    // Este efecto se ejecuta cuando cambia el formData
  }, [formData]);

  const handleInputChange = (field, value) => {
    // Actualizar el estado del formulario
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error inmediatamente
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar ID del Pedido
    if (!formData.orderId.trim()) {
      newErrors.orderId = 'El ID del pedido es requerido';
    } else if (!/^[A-Z0-9]+$/.test(formData.orderId.trim())) {
      newErrors.orderId = 'El ID debe contener solo letras y números';
    }
    
    // Validar Nombre del Cliente
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = 'El nombre debe tener al menos 2 caracteres';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.clientName.trim())) {
      newErrors.clientName = 'El nombre no puede contener números ni caracteres especiales';
    }
    
    // Validar Teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[0-9]{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'El teléfono debe tener exactamente 9 dígitos';
    }
    
    // Validar Distrito
    if (!formData.district) {
      newErrors.district = 'Debe seleccionar un distrito';
    }
    
    // Validar Dirección
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    } else if (formData.address.trim().length < 3) {
      newErrors.address = 'La dirección debe tener al menos 3 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancelar",
      "¿Estás seguro de que quieres cancelar el ingreso del pedido?",
      [
        { text: "NO", style: "cancel" },
        { 
          text: "SÍ", 
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleAccept = () => {
    if (validateForm()) {
      // Navegar a la pantalla de confirmación
      navigation.navigate('OrderSuccess', { orderData: formData });
    } else {
      Alert.alert(
        "Formulario incompleto",
        "Por favor corrige los errores antes de continuar."
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "CANCELAR", style: "cancel" },
        { 
          text: "SÍ", 
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  const handleScanPress = () => navigation.navigate('ScanPhase1');
  const handleAddPress = () => console.log('Add new route pressed');
  const handleMenuPress = () => console.log('Menu pressed');

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
          <FormInputWithIcon
            label="ID del Pedido"
            value={formData.orderId}
            onChangeText={(value) => handleInputChange('orderId', value.toUpperCase())}
            placeholder="Ej: PED001"
            iconName="document-text"
            error={errors.orderId}
            autoCapitalize="characters"
          />
          
          <FormInputWithIcon
            label="Nombre del cliente"
            value={formData.clientName}
            onChangeText={(value) => handleInputChange('clientName', value)}
            placeholder="Ingrese el nombre completo"
            iconName="person"
            error={errors.clientName}
            autoCapitalize="words"
          />
          
          <FormInputWithIcon
            label="Teléfono"
            value={formData.phone}
            onChangeText={(value) => {
              const cleanValue = value.replace(/[^0-9]/g, '');
              if (cleanValue.length <= 9) {
                handleInputChange('phone', cleanValue);
              }
            }}
            placeholder="Ej: 987654321"
            iconName="call"
            error={errors.phone}
            keyboardType="numeric"
          />
          
          <DistrictSelector
            label="Distrito"
            value={formData.district}
            onSelect={(value) => handleInputChange('district', value)}
            error={errors.district}
          />
          
          <FormInputWithIcon
            label="Dirección"
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Ingrese la dirección completa"
            iconName="location"
            error={errors.address}
            autoCapitalize="words"
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
          >
            <Text style={styles.acceptButtonText}>ACEPTAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomBar 
        onScanPress={handleScanPress}
        onAddPress={handleAddPress}
        onMenuPress={handleMenuPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  formContainer: {
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 0.45,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 0.45,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ManualOrderScreen;
