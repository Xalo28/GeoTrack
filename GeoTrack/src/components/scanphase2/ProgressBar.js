import React from 'react';
import { View, Text, Animated } from 'react-native';
import { styles } from './styles';

export const ProgressBar = ({ progressAnim, progress }) => {
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { width: progressWidth }
          ]} 
        />
      </View>
      
      <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
    </View>
  );
};
export default ProgressBar;