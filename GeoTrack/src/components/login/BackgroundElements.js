import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const BackgroundElements = () => {
  return (
    <>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={[styles.backgroundGradient, { height }]}
      />
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
    </>
  );
};

export default BackgroundElements;