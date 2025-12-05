import React from 'react';
import { View, Text, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from './styles';

const LogoHeader = ({ pulseAnim }) => {
  return (
    <View style={styles.logoContainer}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <View style={styles.logoCircle}>
          <FontAwesome5 name="shipping-fast" size={60} color="#5CE1E6" />
        </View>
      </Animated.View>
      
      <Text style={styles.appName}>SAVA S.A.C</Text>
      <View style={styles.divider} />
      <Text style={styles.tagline}>Gestión de Logística Inteligente</Text>
    </View>
  );
};

export default LogoHeader;