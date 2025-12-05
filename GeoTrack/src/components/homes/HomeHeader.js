import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const HomeHeader = ({ onProfilePress, onMenuPress, userName }) => {
  return (
    <View style={styles.customHeader}>
      <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
        <LinearGradient
          colors={['#5CE1E6', '#00adb5']}
          style={styles.profileCircle}
        >
          <Text style={styles.profileInitial}>JL</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>RUTAS</Text>
        <Text style={styles.headerSubtitle}>{userName}</Text>
      </View>
      
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <MaterialIcons name="menu" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default HomeHeader;