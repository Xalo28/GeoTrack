import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  TextInput,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useOrders } from '../context/OrdersContext';
const { width, height } = Dimensions.get('window');

const formatSpanishDate = () => {
  const date = new Date();
  
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName.toUpperCase()}, ${day} DE ${month.toUpperCase()} DE ${year}`;
};

const DISTRICTS = [
  'SAN JUAN DE LURIGANCHO',
  'SANTIAGO DE SURCO',
  'MIRAFLORES',
  'SAN ISIDRO',
  'LA MOLINA',
  'SURCO',
  'CHORRILLOS',
  'VILLA EL SALVADOR',
  'SAN MIGUEL',
  'MAGDALENA',
  'PUEBLO LIBRE',
  'JESÚS MARÍA',
  'LINCE',
  'LA VICTORIA',
  'BREÑA',
  'LIMA',
  'RIMAC',
  'SANTA ANITA',
  'ATE',
  'SANTA ROSA',
  'EL AGUSTINO',
  'SAN JUAN DE MIRAFLORES',
  'VILLA MARÍA DEL TRIUNFO',
  'PACHACAMAC',
  'PUNTA HERMOSA',
  'PUNTA NEGRA',
  'SAN BARTOLO',
  'SANTA MARÍA DEL MAR',
  'PUCUSANA'
];

const ManualOrderScreen = ({ navigation, route }) => {
  const { addOrder } = useOrders();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalScale] = useState(new Animated.Value(0.5));
  const [modalOpacity] = useState(new Animated.Value(0));
  const [savedOrder, setSavedOrder] = useState(null);
  const [districtModal, setDistrictModal] = useState(false);
  const [currentDate] = useState(formatSpanishDate());

  const isEditMode = route.params?.orderData;
  const editOrderData = route.params?.orderData;

  const [formData, setFormData] = useState({
    orderId: '',
    clientName: '',
    phone: '',
    district: '',
    address: ''
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
        address: editOrderData.informacionContacto?.direccion || ''
      });
    }
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isEditMode, editOrderData]);

  const animateModalIn = () => {
    setShowSuccessModal(true);
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const animateModalOut = () => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 0.5,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowSuccessModal(false);
    });
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
    setDistrictModal(false);
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.clientName.trim()) { 
      newErrors.clientName = 'Requerido'; 
      isValid = false; 
    }
    if (!formData.phone.trim()) { 
      newErrors.phone = 'Requerido'; 
      isValid = false; 
    }
    if (!formData.district.trim()) { 
      newErrors.district = 'Requerido'; 
      isValid = false; 
    }
    if (!formData.address.trim()) { 
      newErrors.address = 'Requerido'; 
      isValid = false; 
    }

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
    if (formData.orderId.trim()) {
      return formData.orderId;
    }
    
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
        
        const newOrder = {
          numeroPedido: generateOrderId(),
          cliente: formData.clientName.trim(),
          distrito: formData.district,
          informacionContacto: {
            telefono: phoneFormatted,
            direccion: formData.address.trim()
          },
          productos: ['Entrega Manual', 'Paquete Estándar'],
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
              address: ''
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
    setTimeout(() => {
      navigation.navigate('Home');
    }, 300);
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

  const DistrictSelector = () => (
    <Modal
      visible={districtModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setDistrictModal(false)}
    >
      <View style={styles.modalDistrictOverlay}>
        <View style={styles.modalDistrictContent}>
          <View style={styles.modalDistrictHeader}>
            <Text style={styles.modalDistrictTitle}>Seleccionar Distrito</Text>
            <TouchableOpacity 
              style={styles.modalDistrictCloseButton}
              onPress={() => setDistrictModal(false)}
            >
              <Text style={styles.modalDistrictCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.districtList}>
            {DISTRICTS.map((district, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.districtItem,
                  formData.district === district && styles.selectedDistrict
                ]}
                onPress={() => handleDistrictSelect(district)}
              >
                <Text style={[
                  styles.districtItemText,
                  formData.district === district && styles.selectedDistrictText
                ]}>
                  {district}
                </Text>
                {formData.district === district && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {isEditMode ? "EDITAR PEDIDO" : "NUEVO PEDIDO"}
          </Text>
          <Text style={styles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <TouchableOpacity style={styles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <MaterialIcons name="assignment" size={24} color="#5CE1E6" />
              <Text style={styles.sectionTitle}>Ingrese datos del pedido</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ID Pedido (Opcional)</Text>
                <View style={[
                  styles.inputContainer,
                  errors.orderId && styles.inputError
                ]}>
                  <MaterialIcons name="barcode" size={20} color="#5CE1E6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.orderId}
                    onChangeText={(v) => handleInputChange('orderId', v)}
                    placeholder="Ej: PED-001"
                    placeholderTextColor="#a0a0c0"
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Cliente</Text>
                  <Text style={styles.requiredStar}> *</Text>
                </View>
                <View style={[
                  styles.inputContainer,
                  errors.clientName && styles.inputError
                ]}>
                  <MaterialIcons name="person" size={20} color="#5CE1E6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.clientName}
                    onChangeText={(v) => handleInputChange('clientName', v)}
                    placeholder="Nombre completo"
                    placeholderTextColor="#a0a0c0"
                    autoCapitalize="words"
                  />
                </View>
                {errors.clientName && (
                  <Text style={styles.errorText}>{errors.clientName}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Teléfono</Text>
                  <Text style={styles.requiredStar}> *</Text>
                </View>
                <View style={[
                  styles.inputContainer,
                  errors.phone && styles.inputError
                ]}>
                  <MaterialIcons name="phone" size={20} color="#5CE1E6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.phone}
                    onChangeText={(v) => handleInputChange('phone', v)}
                    placeholder="Ej: 999 999 999"
                    placeholderTextColor="#a0a0c0"
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Distrito</Text>
                  <Text style={styles.requiredStar}> *</Text>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.inputContainer,
                    errors.district && styles.inputError
                  ]}
                  onPress={() => setDistrictModal(true)}
                >
                  <MaterialIcons name="location-on" size={20} color="#5CE1E6" style={styles.inputIcon} />
                  <Text style={[
                    styles.districtText,
                    !formData.district && styles.placeholderText
                  ]}>
                    {formData.district || 'Seleccione un distrito'}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#a0a0c0" />
                </TouchableOpacity>
                {errors.district && (
                  <Text style={styles.errorText}>{errors.district}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Dirección</Text>
                  <Text style={styles.requiredStar}> *</Text>
                </View>
                <View style={[
                  styles.inputContainer,
                  errors.address && styles.inputError
                ]}>
                  <MaterialIcons name="location-on" size={20} color="#5CE1E6" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={formData.address}
                    onChangeText={(v) => handleInputChange('address', v)}
                    placeholder="Av. Principal 123"
                    placeholderTextColor="#a0a0c0"
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              <View style={styles.infoContainer}>
                <MaterialIcons name="info" size={16} color="#5CE1E6" />
                <Text style={styles.infoText}>
                  Los campos marcados con * son obligatorios
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]} 
                onPress={() => navigation.goBack()}
                disabled={isSaving}
              >
                <Text style={styles.cancelText}>CANCELAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.acceptButton, 
                  isSaving && styles.disabledButton
                ]} 
                onPress={handleAccept}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.acceptText}>
                    {isEditMode ? 'ACTUALIZAR' : 'GUARDAR'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
          <Animated.View style={[
            styles.modalContent,
            {
              transform: [{ scale: modalScale }],
              opacity: modalOpacity
            }
          ]}>
            <LinearGradient
              colors={['#4ECB71', '#2e7d32']}
              style={styles.successIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="check" size={40} color="#FFFFFF" />
            </LinearGradient>
            
            <Text style={styles.modalTitle}>
              ¡{isEditMode ? 'Pedido Actualizado!' : 'Pedido Guardado!'}
            </Text>
            
            <Text style={styles.modalSubtitle}>
              {isEditMode 
                ? 'Los cambios se han guardado correctamente.'
                : 'El pedido ha sido registrado exitosamente.'
              }
            </Text>
            
            {savedOrder && (
              <View style={styles.orderInfo}>
                <View style={styles.orderInfoRow}>
                  <MaterialIcons name="receipt" size={16} color="#5CE1E6" />
                  <Text style={styles.orderInfoLabel}>Número de Pedido:</Text>
                  <Text style={styles.orderInfoValue}>{savedOrder.numeroPedido}</Text>
                </View>
                
                <View style={styles.orderInfoRow}>
                  <MaterialIcons name="person" size={16} color="#5CE1E6" />
                  <Text style={styles.orderInfoLabel}>Cliente:</Text>
                  <Text style={styles.orderInfoValue}>{savedOrder.cliente}</Text>
                </View>
                
                <View style={styles.orderInfoRow}>
                  <MaterialIcons name="location-on" size={16} color="#5CE1E6" />
                  <Text style={styles.orderInfoLabel}>Distrito:</Text>
                  <Text style={styles.orderInfoValue}>{savedOrder.distrito}</Text>
                </View>
                
                <View style={styles.orderInfoRow}>
                  <MaterialIcons name="access-time" size={16} color="#5CE1E6" />
                  <Text style={styles.orderInfoLabel}>Hora de registro:</Text>
                  <Text style={styles.orderInfoValue}>{savedOrder.fechaCreacion}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleCreateAnother}
              >
                <Text style={styles.modalButtonSecondaryText}>
                  {isEditMode ? 'VOLVER' : 'CREAR OTRO'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleGoToOrders}
              >
                <LinearGradient
                  colors={['#5CE1E6', '#00adb5']}
                  style={styles.modalButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalButtonPrimaryText}>VER PEDIDOS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      <DistrictSelector />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 200 : 180,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(92, 225, 230, 0.3)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#e0e0ff',
    fontWeight: '500',
  },
  requiredStar: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    padding: 0,
  },
  districtText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  placeholderText: {
    color: '#a0a0c0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 12,
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#5CE1E6',
  },
  infoText: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
  },
  acceptButton: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelText: {
    color: '#FF4444',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalDistrictOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDistrictContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalDistrictHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalDistrictTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalDistrictCloseButton: {
    padding: 5,
  },
  modalDistrictCloseText: {
    fontSize: 18,
    color: '#a0a0c0',
  },
  districtList: {
    maxHeight: 400,
  },
  districtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedDistrict: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
  },
  districtItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  selectedDistrictText: {
    color: '#5CE1E6',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#4ECB71',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 25,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.3)',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  orderInfo: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  orderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderInfoLabel: {
    fontSize: 12,
    color: '#a0a0c0',
    marginLeft: 8,
    marginRight: 5,
    width: 120,
  },
  orderInfoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  modalButtonPrimary: {
    backgroundColor: 'transparent',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondaryText: {
    color: '#5CE1E6',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 14,
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ManualOrderScreen;