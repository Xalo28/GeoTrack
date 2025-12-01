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
        { 
          text: "SÍ", 
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleAccept = () => {
    // Agregamos console.log para debuggear
    console.log('Button pressed');
    console.log('Form data:', formData);

    if (validateForm()) {
      console.log('Form is valid');
      
      const newOrder = {
        cliente: formData.clientName.trim(),
        numeroPedido: Date.now().toString(),
        informacionContacto: {
          telefono: formData.phone.trim(),
          direccion: formData.address.trim()
        },
        distrito: formData.district.trim()
      };

      try {
        addOrder(newOrder);
        console.log('Order added successfully');
        
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error adding order:', error);
        Alert.alert(
          "Error",
          "No se pudo registrar el pedido. Por favor intente nuevamente."
        );
      }
    } else {
      console.log('Form validation failed', errors);
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
            activeOpacity={0.7}
          >
            <Text style={styles.acceptButtonText}>Aceptar</Text>
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