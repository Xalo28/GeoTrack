import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const StepsIndicator = ({ progress, isComplete }) => {
  const steps = [
    { label: 'Escaneo', isActive: true },
    { label: 'Verificación', isActive: progress > 20 },
    { label: 'Procesando', isActive: progress > 50 },
    { label: 'Completado', isActive: isComplete },
  ];

  return (
    <View style={styles.stepsContainer}>
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <View style={styles.step}>
            <View style={[
              styles.stepDot, 
              step.isActive && styles.stepDotActive
            ]} />
            <Text style={[
              styles.stepText, 
              step.isActive && styles.stepTextActive
            ]}>{step.label}</Text>
          </View>
          
          {index < steps.length - 1 && (
            <View style={styles.stepLine} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};
export default StepsIndicator;