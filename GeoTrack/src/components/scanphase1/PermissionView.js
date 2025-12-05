import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

const PermissionView = ({ hasPermission, onRequestPermission, refreshing, onRefresh }) => {
  if (hasPermission === null) {
    return (
      <View style={permissionStyles.container}>
        <MaterialIcons name="camera" size={60} color="#5CE1E6" />
        <Text style={permissionStyles.text}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <ScrollView
        contentContainerStyle={permissionStyles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5CE1E6"
            colors={['#5CE1E6']}
          />
        }
      >
        <View style={permissionStyles.container}>
          <MaterialIcons name="camera-off" size={60} color="#FF4444" />
          <Text style={permissionStyles.text}>Sin acceso a la cámara</Text>
          <Text style={permissionStyles.subtext}>
            Necesitas conceder permisos para usar la función de escaneo
          </Text>
          <TouchableOpacity
            style={permissionStyles.button}
            onPress={onRequestPermission}
          >
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              style={permissionStyles.buttonGradient}
            >
              <Text style={permissionStyles.buttonText}>Conceder Permiso</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return null;
};

const permissionStyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    width: '80%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
};

export default PermissionView;