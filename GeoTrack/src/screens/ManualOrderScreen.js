import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, ScrollView,  KeyboardAvoidingView, Platform, Animated, Dimensions, SafeAreaView,Text, Alert
} from 'react-native';
import HeaderSection from '../components/manualorder/HeaderSection';
import DistrictSelectorModal from '../components/manualorder/DistrictSelectorModal';
import SuccessModal from '../components/manualorder/SuccessModal';
import InputField from '../components/manualorder/InputField';
import AddressAutocomplete from '../components/manualorder/AddressAutocomplete';
import ActionButtons from '../components/manualorder/ActionButtons';
import { useOrders } from '../context/OrdersContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

const formatSpanishDate = () => {
  const date = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${days[date.getDay()].toUpperCase()}, ${date.getDate()} DE ${months[date.getMonth()].toUpperCase()} DE ${date.getFullYear()}`;
};

const ManualOrderScreen = ({ navigation, route }) => {
  const { addOrder } = useOrders();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalScale] = useState(new Animated.Value(0.5));
  const [modalOpacity] = useState(new Animated.Value(0));
  const [savedOrder, setSavedOrder] = useState(null);
  const [districtModal, setDistrictModal] = useState(false);
  const [currentDate] = useState(formatSpanishDate());
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const isEditMode = route.params?.orderData;
  const editOrderData = route.params?.orderData;

  const [formData, setFormData] = useState({
    orderId: '',
    clientName: '',
    phone: '',
    district: '',
    address: '',
    products: ''
  });

  const [errors, setErrors] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isEditMode && editOrderData) {
      setFormData({
        orderId: editOrderData.numeroPedido || '',
        clientName: editOrderData.cliente || '',
        phone: editOrderData.informacionContacto?.telefono || '',
        district: editOrderData.distrito || '',
        address: editOrderData.informacionContacto?.direccion || '',
        products: Array.isArray(editOrderData.productos) ? editOrderData.productos.join(', ') : (editOrderData.productos || '')
      });
    }
    
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [isEditMode, editOrderData]);

  const animateModalIn = () => {
    setShowSuccessModal(true);
    Animated.parallel([
      Animated.spring(modalScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(modalOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const animateModalOut = () => {
    Animated.parallel([
      Animated.spring(modalScale, { toValue: 0.5, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start(() => setShowSuccessModal(false));
  };

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

  const handleDistrictSelect = (district) => {
    handleInputChange('district', district);
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.clientName.trim()) { newErrors.clientName = 'Requerido'; isValid = false; }
    if (!formData.phone.trim()) { newErrors.phone = 'Requerido'; isValid = false; }
    if (!formData.district.trim()) { newErrors.district = 'Requerido'; isValid = false; }
    if (!formData.address.trim()) { newErrors.address = 'Requerido'; isValid = false; }
    if (!formData.products.trim()) { newErrors.products = 'Requerido'; isValid = false; }

    if (formData.phone.trim() && !/^[0-9\s\+\-\(\)]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono inválido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return phone;
  };

  const generateOrderId = () => {
    if (formData.orderId.trim()) return formData.orderId;
    const timestamp = Date.now().toString().slice(-4);
    const randomChars = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `MAN-${timestamp}-${randomChars}`;
  };

  const handleAccept = async () => {
    if (validateForm()) {
      try {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const phoneFormatted = formatPhoneNumber(formData.phone);
        const currentDateObj = new Date();
        const formattedTime = `${String(currentDateObj.getHours()).padStart(2, '0')}:${String(currentDateObj.getMinutes()).padStart(2, '0')}`;
        
        const productsArray = formData.products.split(',').map(p => p.trim()).filter(p => p !== '');

        const newOrder = {
          numeroPedido: generateOrderId(),
          cliente: formData.clientName.trim(),
          distrito: formData.district,
          informacionContacto: {
            telefono: phoneFormatted,
            direccion: formData.address.trim()
          },
          productos: productsArray.length > 0 ? productsArray : ['Carga General'],
          fechaCreacion: formattedTime,
          fechaCreacionObj: currentDateObj,
          estado: 'pendiente',
          tipo: 'manual',
          ...(isEditMode && { id: editOrderData.id })
        };

        addOrder(newOrder);
        setSavedOrder(newOrder);
        animateModalIn();

        if (!isEditMode) {
          setTimeout(() => {
            setFormData({
              orderId: '',
              clientName: '',
              phone: '',
              district: '',
              address: '',
              products: ''
            });
          }, 500);
        }

      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo guardar el pedido");
      } finally {
        setIsSaving(false);
      }
    } else {
      Alert.alert("Campos incompletos", "Por favor revisa los campos marcados en rojo.");
    }
  };

  const handleGoToOrders = () => {
    animateModalOut();
    setTimeout(() => { navigation.navigate('Home'); }, 300);
  };

  const handleCreateAnother = () => {
    animateModalOut();
    if (!isEditMode) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
      }, 300);
    } else {
      navigation.goBack();
    }
  };

  const scrollViewRef = useRef();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.backgroundGradient} />

      <HeaderSection 
        navigation={navigation}
        isEditMode={isEditMode}
        currentDate={currentDate}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.formSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="assignment" size={24} color="#5CE1E6" />
              <Text style={styles.sectionTitle}>Ingrese datos del pedido</Text>
            </View>

            <View style={styles.formContainer}>
              {/* ID PEDIDO */}
              <InputField
                label="ID Pedido (Opcional)"
                value={formData.orderId}
                onChangeText={(v) => handleInputChange('orderId', v)}
                placeholder="Ej: PED-001"
                iconName="qr-code"
                error={errors.orderId}
                autoCapitalize="characters"
              />

              {/* CLIENTE */}
              <InputField
                label="Cliente"
                value={formData.clientName}
                onChangeText={(v) => handleInputChange('clientName', v)}
                placeholder="Nombre completo"
                iconName="person"
                error={errors.clientName}
                required
                autoCapitalize="words"
              />

              {/* TELEFONO */}
              <InputField
                label="Teléfono"
                value={formData.phone}
                onChangeText={(v) => handleInputChange('phone', v)}
                placeholder="Ej: 999 999 999"
                iconName="phone"
                error={errors.phone}
                required
                keyboardType="phone-pad"
                maxLength={15}
              />

              {/* DISTRITO */}
              <InputField
                label="Distrito"
                value={formData.district}
                placeholder="Seleccione un distrito"
                iconName="location-city"
                error={errors.district}
                required
                isDistrict
                onDistrictPress={() => setDistrictModal(true)}
              />

              {/* DIRECCIÓN CON AUTOCOMPLETADO */}
              <AddressAutocomplete
                label="Dirección"
                value={formData.address}
                onChangeText={(v) => handleInputChange('address', v)}
                error={errors.address}
                district={formData.district}
                isLoading={isLoadingAddress}
                onLoadingChange={setIsLoadingAddress}
              />

              {/* PRODUCTOS */}
              <InputField
                label="Productos"
                value={formData.products}
                onChangeText={(v) => handleInputChange('products', v)}
                placeholder="Ej: 2 Cajas, 1 Paquete..."
                iconName="inventory"
                error={errors.products}
                required
              />

              <View style={styles.infoContainer}>
                <MaterialIcons name="info" size={16} color="#5CE1E6" />
                <Text style={styles.infoText}>Los campos marcados con * son obligatorios</Text>
              </View>
            </View>

            <ActionButtons
              onCancel={() => navigation.goBack()}
              onAccept={handleAccept}
              isSaving={isSaving}
              isEditMode={isEditMode}
            />
          </Animated.View>
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccessModal}
        onClose={animateModalOut}
        modalScale={modalScale}
        modalOpacity={modalOpacity}
        isEditMode={isEditMode}
        savedOrder={savedOrder}
        onCreateAnother={handleCreateAnother}
        onGoToOrders={handleGoToOrders}
      />

      <DistrictSelectorModal
        visible={districtModal}
        onClose={() => setDistrictModal(false)}
        selectedDistrict={formData.district}
        onSelectDistrict={handleDistrictSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1a1a2e' 
  },
  backgroundGradient: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    top: 0, 
    height: Platform.OS === 'ios' ? 200 : 180 
  },
  keyboardView: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: { 
    paddingBottom: 20 
  },
  formSection: { 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25, 
    paddingBottom: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(92, 225, 230, 0.3)' 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginLeft: 10 
  },
  formContainer: { 
    marginBottom: 20 
  },
  infoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10, 
    padding: 12, 
    backgroundColor: 'rgba(92, 225, 230, 0.1)', 
    borderRadius: 10, 
    borderLeftWidth: 3, 
    borderLeftColor: '#5CE1E6' 
  },
  infoText: { 
    fontSize: 12, 
    color: '#5CE1E6', 
    marginLeft: 10, 
    flex: 1 
  },
});

export default ManualOrderScreen;