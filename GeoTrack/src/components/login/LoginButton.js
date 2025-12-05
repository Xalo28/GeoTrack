import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  Animated // Importar Animated aquí también
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

// Crear el componente animado CORRECTAMENTE
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const LoginButton = ({ loading, pulseAnim, onPress, disabled }) => {
  return (
    <AnimatedTouchableOpacity 
      style={[styles.authButton, { transform: [{ scale: pulseAnim }] }]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#5CE1E6', '#00adb5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonGradient}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <MaterialIcons name="login" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.authButtonText}>INGRESAR / REGISTRARSE</Text>
          </>
        )}
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
};

export default LoginButton;