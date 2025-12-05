import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  Modal,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

const SecurityScreen = ({ navigation }) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15min');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordErrors, setPasswordErrors] = useState({});
  const [modalScale] = useState(new Animated.Value(0.5));
  const [modalOpacity] = useState(new Animated.Value(0));
  
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const recentActivity = [
    {
      id: 1,
      action: 'Inicio de sesión',
      location: 'Lima, Perú',
      device: 'iPhone 14 Pro',
      time: 'Hace 5 minutos',
      status: 'success',
      icon: 'login'
    },
    {
      id: 2,
      action: 'Cambio de contraseña',
      location: 'Lima, Perú',
      device: 'iPhone 14 Pro',
      time: 'Hace 3 días',
      status: 'success',
      icon: 'vpn-key'
    },
    {
      id: 3,
      action: 'Intento de acceso',
      location: 'Buenos Aires, AR',
      device: 'Samsung Galaxy S22',
      time: 'Hace 1 semana',
      status: 'failed',
      icon: 'warning'
    },
    {
      id: 4,
      action: 'Activación biometría',
      location: 'Lima, Perú',
      device: 'iPhone 14 Pro',
      time: 'Hace 2 semanas',
      status: 'success',
      icon: 'fingerprint'
    }
  ];

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometryType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometryType('Huella digital');
        }
        
        setBiometricsEnabled(true);
      }
    } catch (error) {
      console.error('Error checking biometrics:', error);
    }
  };

  const toggleBiometrics = async () => {
    if (!biometricsEnabled) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Autenticar para activar biometría',
          fallbackLabel: 'Usar contraseña',
        });

        if (result.success) {
          setBiometricsEnabled(true);
          Alert.alert('Éxito', 'Biometría activada correctamente');
        } else {
          Alert.alert('Error', 'Autenticación fallida');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo activar la biometría');
      }
    } else {
      setBiometricsEnabled(false);
      Alert.alert('Biometría desactivada', 'Ahora deberás usar tu contraseña para ingresar');
    }
  };

  const animateModalIn = () => {
    setChangePasswordModal(true);
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
      setChangePasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
    });
  };

  const validatePasswordForm = () => {
    let errors = {};
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Requerido';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'Requerido';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Mínimo 8 caracteres';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Requerido';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleChangePassword = () => {
    if (validatePasswordForm()) {
      setTimeout(() => {
        animateModalOut();
        Alert.alert(
          'Contraseña Actualizada',
          'Tu contraseña ha sido cambiada exitosamente.',
          [{ text: 'Entendido', style: 'default' }]
        );
      }, 1500);
    }
  };

  const SecurityItem = ({ icon, title, subtitle, action, onPress, isLast = false }) => (
    <TouchableOpacity 
      style={[styles.securityItem, isLast && styles.securityItemLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.securityItemContent}>
        <View style={[styles.securityIcon, { backgroundColor: `${getIconColor(icon)}20` }]}>
          <MaterialIcons name={icon} size={22} color={getIconColor(icon)} />
        </View>
        <View style={styles.securityTextContainer}>
          <Text style={styles.securityTitle}>{title}</Text>
          <Text style={styles.securitySubtitle}>{subtitle}</Text>
        </View>
      </View>
      {action && (
        <View style={styles.securityAction}>
          {typeof action === 'string' ? (
            <>
              <Text style={styles.securityActionText}>{action}</Text>
              <MaterialIcons name="chevron-right" size={20} color="#a0a0c0" />
            </>
          ) : (
            action
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const getIconColor = (icon) => {
    switch(icon) {
      case 'vpn-key': return '#5CE1E6';
      case 'fingerprint': return '#4ECB71';
      case 'timer': return '#FFA726';
      case 'security': return '#9575CD';
      case 'history': return '#FF7043';
      case 'logout': return '#FF4444';
      default: return '#5CE1E6';
    }
  };

  const TimeoutOption = ({ value, label, isSelected, onSelect }) => (
    <TouchableOpacity 
      style={[styles.timeoutOption, isSelected && styles.timeoutOptionSelected]}
      onPress={() => onSelect(value)}
      activeOpacity={0.7}
    >
      <View style={styles.timeoutRadio}>
        <View style={[styles.timeoutRadioInner, isSelected && styles.timeoutRadioSelected]} />
      </View>
      <Text style={[styles.timeoutText, isSelected && styles.timeoutTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PasswordInput = ({ label, value, onChangeText, error, secureTextEntry = true, placeholder }) => (
    <View style={styles.passwordInputGroup}>
      <Text style={styles.passwordLabel}>{label}</Text>
      <View style={[styles.passwordInputContainer, error && styles.inputError]}>
        <MaterialIcons name="lock" size={20} color="#5CE1E6" style={styles.inputIcon} />
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor="#666"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle}>SEGURIDAD</Text>
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
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="security" size={20} color="#5CE1E6" />
            <Text style={styles.sectionTitle}>AUTENTICACIÓN</Text>
          </View>
          
          <View style={styles.securityList}>
            <SecurityItem 
              icon="vpn-key" 
              title="Cambiar Contraseña" 
              subtitle="Actualiza tu clave de acceso"
              action="Cambiar"
              onPress={animateModalIn}
            />
            <SecurityItem 
              icon="fingerprint" 
              title="Biometría" 
              subtitle={biometryType ? `Usar ${biometryType} para entrar` : 'No disponible'}
              action={
                <TouchableOpacity 
                  style={[styles.biometricToggle, biometricsEnabled && styles.biometricToggleActive]}
                  onPress={toggleBiometrics}
                  activeOpacity={0.8}
                >
                  <View style={[styles.toggleThumb, biometricsEnabled && styles.toggleThumbActive]} />
                </TouchableOpacity>
              }
              onPress={toggleBiometrics}
            />
            <SecurityItem 
              icon="security" 
              title="Autenticación de Dos Factores" 
              subtitle="Agrega una capa extra de seguridad"
              action={
                <TouchableOpacity 
                  style={[styles.biometricToggle, twoFactorEnabled && styles.biometricToggleActive]}
                  onPress={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.toggleThumb, twoFactorEnabled && styles.toggleThumbActive]} />
                </TouchableOpacity>
              }
              onPress={() => setTwoFactorEnabled(!twoFactorEnabled)}
              isLast={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="timer" size={20} color="#5CE1E6" />
            <Text style={styles.sectionTitle}>CONFIGURACIÓN DE SESIÓN</Text>
          </View>
          
          <View style={styles.sessionContainer}>
            <Text style={styles.sessionTitle}>Tiempo de cierre automático</Text>
            <Text style={styles.sessionSubtitle}>
              La sesión se cerrará automáticamente después de:
            </Text>
            
            <View style={styles.timeoutOptions}>
              <TimeoutOption 
                value="5min"
                label="5 minutos"
                isSelected={sessionTimeout === '5min'}
                onSelect={setSessionTimeout}
              />
              <TimeoutOption 
                value="15min"
                label="15 minutos"
                isSelected={sessionTimeout === '15min'}
                onSelect={setSessionTimeout}
              />
              <TimeoutOption 
                value="30min"
                label="30 minutos"
                isSelected={sessionTimeout === '30min'}
                onSelect={setSessionTimeout}
              />
              <TimeoutOption 
                value="1hour"
                label="1 hora"
                isSelected={sessionTimeout === '1hour'}
                onSelect={setSessionTimeout}
              />
              <TimeoutOption 
                value="never"
                label="Nunca"
                isSelected={sessionTimeout === 'never'}
                onSelect={setSessionTimeout}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="history" size={20} color="#5CE1E6" />
            <Text style={styles.sectionTitle}>ACTIVIDAD RECIENTE</Text>
          </View>
          
          <View style={styles.activityContainer}>
            {recentActivity.slice(0, 3).map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: activity.status === 'success' ? '#4ECB7120' : '#FF444420' }
                ]}>
                  <MaterialIcons 
                    name={activity.icon} 
                    size={18} 
                    color={activity.status === 'success' ? '#4ECB71' : '#FF4444'} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityDetails}>
                    {activity.device} • {activity.location}
                  </Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={18} color="#5CE1E6" />
            <Text style={styles.infoTitle}>Consejos de Seguridad</Text>
          </View>
          <Text style={styles.infoText}>
            • Usa una contraseña única y compleja{'\n'}
            • Activa la autenticación de dos factores{'\n'}
            • Revisa regularmente tu actividad de inicio de sesión{'\n'}
            • Cierra sesión en dispositivos públicos
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutAllButton}
          onPress={() => Alert.alert(
            'Cerrar sesión en todos los dispositivos',
            'Esta acción cerrará tu sesión en todos los dispositivos donde hayas iniciado.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Continuar', 
                onPress: () => Alert.alert('Éxito', 'Sesiones cerradas en todos los dispositivos')
              }
            ]
          )}
        >
          <MaterialIcons name="logout" size={20} color="#FF4444" />
          <Text style={styles.logoutAllText}>Cerrar sesión en todos los dispositivos</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal
        visible={changePasswordModal}
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
              <TouchableOpacity onPress={animateModalOut}>
                <MaterialIcons name="close" size={24} color="#a0a0c0" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <PasswordInput
                label="Contraseña Actual"
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                error={passwordErrors.currentPassword}
                placeholder="Ingresa tu contraseña actual"
              />
              
              <PasswordInput
                label="Nueva Contraseña"
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                error={passwordErrors.newPassword}
                placeholder="Mínimo 8 caracteres"
              />
              
              <PasswordInput
                label="Confirmar Nueva Contraseña"
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                error={passwordErrors.confirmPassword}
                placeholder="Repite la nueva contraseña"
              />
              
              <View style={styles.passwordRules}>
                <Text style={styles.rulesTitle}>Requisitos de contraseña:</Text>
                <Text style={styles.ruleItem}>• Mínimo 8 caracteres</Text>
                <Text style={styles.ruleItem}>• Al menos una letra mayúscula</Text>
                <Text style={styles.ruleItem}>• Al menos un número</Text>
                <Text style={styles.ruleItem}>• Al menos un carácter especial</Text>
              </View>
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={animateModalOut}
              >
                <Text style={styles.modalButtonSecondaryText}>CANCELAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleChangePassword}
              >
                <LinearGradient
                  colors={['#5CE1E6', '#00adb5']}
                  style={styles.modalButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalButtonPrimaryText}>CAMBIAR</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(92, 225, 230, 0.3)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  securityList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  securityItemLast: {
    borderBottomWidth: 0,
  },
  securityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  securitySubtitle: {
    fontSize: 12,
    color: '#a0a0c0',
  },
  securityAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityActionText: {
    fontSize: 12,
    color: '#5CE1E6',
    fontWeight: 'bold',
    marginRight: 5,
  },
  biometricToggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
  },
  biometricToggleActive: {
    backgroundColor: '#5CE1E6',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  sessionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  sessionSubtitle: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 15,
  },
  timeoutOptions: {
    gap: 10,
  },
  timeoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  timeoutOptionSelected: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  timeoutRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#a0a0c0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  timeoutRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  timeoutRadioSelected: {
    backgroundColor: '#5CE1E6',
  },
  timeoutText: {
    fontSize: 14,
    color: '#a0a0c0',
    flex: 1,
  },
  timeoutTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  activityDetails: {
    fontSize: 11,
    color: '#a0a0c0',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 10,
    color: '#5CE1E6',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#5CE1E6',
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#5CE1E6',
    lineHeight: 18,
  },
  logoutAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
  },
  logoutAllText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4444',
    marginLeft: 10,
    flex: 1,
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
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  passwordInputGroup: {
    marginBottom: 20,
  },
  passwordLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  passwordInputContainer: {
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
  passwordInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    padding: 0,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  passwordRules: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  ruleItem: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 5,
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
};

export default SecurityScreen;