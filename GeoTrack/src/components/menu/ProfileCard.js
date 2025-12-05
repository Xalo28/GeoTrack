// src/components/menu/ProfileCard.js
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileCard = ({ 
  name = "Juanito Lopez", 
  role = "Conductor / Repartidor", 
  id = "DRV-2025-001",
  initials = "JL" 
}) => {
  return (
    <View style={styles.profileCard}>
      <LinearGradient
        colors={['rgba(92, 225, 230, 0.2)', 'rgba(0, 173, 181, 0.1)']}
        style={styles.profileGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name}</Text>
          <View style={styles.profileRoleContainer}>
            <MaterialIcons name="directions-car" size={16} color="#5CE1E6" />
            <Text style={styles.profileRole}>{role}</Text>
          </View>
          <View style={styles.profileIdContainer}>
            <MaterialIcons name="badge" size={14} color="#a0a0c0" />
            <Text style={styles.profileId}>ID: {id}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = {
  profileCard: {
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 6,
  },
  profileIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileId: {
    fontSize: 11,
    color: '#a0a0c0',
    marginLeft: 6,
  },
};

export default ProfileCard;