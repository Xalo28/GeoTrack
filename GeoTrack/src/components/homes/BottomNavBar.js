import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const BottomNavBar = ({ onScanPress, onAddPress }) => {
  return (
    <View style={styles.bottomBar}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.95)', 'rgba(26, 26, 46, 0.98)']}
        style={styles.bottomBarGradient}
      >
        <View style={styles.bottomBarContent}>
          <TouchableOpacity style={styles.bottomBarButton} onPress={onScanPress}>
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              style={styles.scanButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons name="qr-code-scanner" size={28} color="#FFFFFF" />
              <Text style={styles.scanButtonText}>ESCANEAR</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bottomBarButton} onPress={onAddPress}>
            <View style={styles.addButton}>
              <MaterialIcons name="add-circle" size={24} color="#5CE1E6" />
              <Text style={styles.bottomBarButtonText}>AGREGAR</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bottomBarButton} onPress={() => {}}>
            <View style={styles.homeButton}>
              <MaterialIcons name="dashboard" size={24} color="#5CE1E6" />
              <Text style={styles.bottomBarButtonText}>INICIO</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = {
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  bottomBarGradient: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarButton: {
    flex: 1,
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  addButton: {
    alignItems: 'center',
  },
  homeButton: {
    alignItems: 'center',
  },
  bottomBarButtonText: {
    fontSize: 12,
    color: '#a0a0c0',
    marginTop: 5,
  },
};

export default BottomNavBar;