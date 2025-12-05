import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const SuccessIcon = ({ scaleAnim, fadeAnim }) => {
  return (
    <Animated.View 
      style={[
        styles.successIconContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim
        }
      ]}
    >
      <LinearGradient
        colors={['#4ECB71', '#2E7D32']}
        style={styles.successCircle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons name="check" size={60} color="#FFFFFF" />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = {
  successIconContainer: {
    marginBottom: 25,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default SuccessIcon;