// src/components/menu/LogoutButton.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const LogoutButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.logoutButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.2)']}
        style={styles.logoutGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.logoutContent}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 68, 68, 0.2)' }]}>
            <MaterialIcons name="exit-to-app" size={24} color="#FF4444" />
          </View>
          <View style={styles.logoutTextContainer}>
            <Text style={styles.logoutTitle}>Cerrar Sesión</Text>
            <Text style={styles.logoutSubtitle}>Salir de tu cuenta actual</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = {
  logoutButton: {
    marginBottom: 25,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutGradient: {
    padding: 15,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  logoutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4444',
    marginBottom: 3,
  },
  logoutSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 68, 68, 0.7)',
  },
};

export default LogoutButton;