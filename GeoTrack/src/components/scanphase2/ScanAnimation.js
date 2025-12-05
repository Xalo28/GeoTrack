import React from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { ProgressBar } from './ProgressBar';

export const ScanAnimation = ({ 
  pulseAnim, 
  processingText, 
  isComplete, 
  progressAnim, 
  progress 
}) => {
  return (
    <Animated.View 
      style={[
        styles.scanArea,
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <LinearGradient
        colors={['rgba(92, 225, 230, 0.1)', 'rgba(92, 225, 230, 0.05)']}
        style={styles.scanAreaGradient}
      >
        <Text style={styles.scanningTitle}>ESCANEANDO</Text>
        
        <View style={styles.processingCard}>
          <Text style={styles.processingText}>{processingText}</Text>
          
          <ProgressBar progressAnim={progressAnim} progress={progress} />
          
          <View style={styles.spinnerContainer}>
            <MaterialIcons 
              name={isComplete ? "check-circle" : "rotate-right"} 
              size={40} 
              color={isComplete ? "#4ECB71" : "#5CE1E6"} 
              style={styles.spinnerIcon}
            />
            <Text style={styles.processingIndicator}>
              {isComplete ? '¡PROCESO COMPLETADO!' : 'PROCESANDO...'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
export default ScanAnimation;