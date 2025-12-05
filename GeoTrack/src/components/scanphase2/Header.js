import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

export const Header = () => {
  return (
    <View style={styles.customHeader}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>ESCANEO FASE - 2</Text>
        <Text style={styles.headerSubtitle}>JUANITO LOPEZ</Text>
      </View>
      
      <View style={styles.profileButton}>
        <LinearGradient
          colors={['#5CE1E6', '#00adb5']}
          style={styles.profileCircle}
        >
          <Text style={styles.profileInitial}>JL</Text>
        </LinearGradient>
      </View>
    </View>
  );
};
export default Header;