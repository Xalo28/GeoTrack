import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const LogoHeader = () => {
  return (
    <View style={styles.logoContainer}>
      <LinearGradient
        colors={['rgba(92, 225, 230, 0.2)', 'rgba(0, 173, 181, 0.1)']}
        style={styles.logoGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FontAwesome5 name="shipping-fast" size={40} color="#5CE1E6" />
        <Text style={styles.logoText}>SAVA LOGÍSTICA</Text>
        <Text style={styles.logoSubtext}>Gestión Inteligente</Text>
      </LinearGradient>
    </View>
  );
};

const styles = {
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logoGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.2)',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: 14,
    color: '#a0a0c0',
    marginTop: 5,
  },
};

export default LogoHeader;