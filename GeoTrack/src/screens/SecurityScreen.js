import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

import { SecurityHeader } from '../components/securityy/SecurityHeader';
import { SectionHeader } from '../components/securityy/SectionHeader';
import { SecurityItem } from '../components/securityy/SecurityItem';
import { TimeoutOption } from '../components/securityy/TimeoutOption';
import { ActivityItem } from '../components/securityy/ActivityItem';
import { ChangePasswordModal } from '../components/securityy/ChangePasswordModal';

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
];

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
        setChangePasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});
        Alert.alert(
          'Contraseña Actualizada',
          'Tu contraseña ha sido cambiada exitosamente.',
          [{ text: 'Entendido', style: 'default' }]
        );
      }, 1500);
    }
  };

  const closeModal = () => {
    setChangePasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <SecurityHeader navigation={navigation} userName="JUANITO LOPEZ" />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <SectionHeader icon="security" title="AUTENTICACIÓN" />
          
          <View style={styles.securityList}>
            <SecurityItem 
              icon="vpn-key" 
              title="Cambiar Contraseña" 
              subtitle="Actualiza tu clave de acceso"
              action="Cambiar"
              onPress={() => setChangePasswordModal(true)}
            />
            <SecurityItem 
              icon="fingerprint" 
              title="Biometría" 
              subtitle={biometryType ? `Usar ${biometryType} para entrar` : 'No disponible'}
              isToggle={true}
              toggleValue={biometricsEnabled}
              onToggleChange={toggleBiometrics}
            />
            <SecurityItem 
              icon="security" 
              title="Autenticación de Dos Factores" 
              subtitle="Agrega una capa extra de seguridad"
              isToggle={true}
              toggleValue={twoFactorEnabled}
              onToggleChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              isLast={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="timer" title="CONFIGURACIÓN DE SESIÓN" />
          
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
          <SectionHeader icon="history" title="ACTIVIDAD RECIENTE" />
          
          <View style={styles.activityContainer}>
            {recentActivity.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
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

      <ChangePasswordModal
        visible={changePasswordModal}
        onClose={closeModal}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        passwordErrors={passwordErrors}
        onSave={handleChangePassword}
      />
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
    height: 180,
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
  securityList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
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
  activityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
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
};

export default SecurityScreen;