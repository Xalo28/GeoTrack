import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  Alert,
  Modal,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';

// Importar estilos
import { styles } from '../styles/SecurityScreenStyles';

const { width } = Dimensions.get('window');

const SecurityScreen = () => {
  const navigation = useNavigation();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15min');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [activityLogVisible, setActivityLogVisible] = useState(false);
  
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

  // Actividad reciente simulada
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
        
        // Verificar si la biometría ya estaba activada
        setBiometricsEnabled(true); // Simulamos que ya está activada
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
      // Simular cambio de contraseña
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
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      {/* Header personalizado */}
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

      {/* Fecha */}
      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de Autenticación */}
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

        {/* Sección de Sesión */}
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

        {/* Sección de Actividad */}
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
            
            {recentActivity.length > 3 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => setActivityLogVisible(true)}
              >
                <Text style={styles.viewAllText}>Ver toda la actividad</Text>
                <MaterialIcons name="chevron-right" size={20} color="#5CE1E6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Información de seguridad */}
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

        {/* Botón de cierre de sesión en todos los dispositivos */}
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

        {/* Espacio final */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal de cambio de contraseña */}
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

export default SecurityScreen;