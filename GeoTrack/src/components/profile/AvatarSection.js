import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

export const AvatarSection = ({ 
  profileImage, 
  onPickImage, 
  fullName, 
  status 
}) => {
  const initials = fullName.split(' ').map(n => n[0]).join('');
  
  return (
    <View style={styles.avatarSection}>
      <TouchableOpacity style={styles.avatarContainer} onPress={onPickImage}>
        <LinearGradient
          colors={['#5CE1E6', '#00adb5']}
          style={styles.avatarGradient}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </LinearGradient>
        <View style={styles.changePhotoButton}>
          <MaterialIcons name="camera-alt" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <Text style={styles.avatarName}>{fullName}</Text>
      <View style={styles.statusBadge}>
        <MaterialIcons name="circle" size={8} color="#4ECB71" />
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};
export default AvatarSection;