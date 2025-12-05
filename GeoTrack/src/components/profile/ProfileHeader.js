import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

export const ProfileHeader = ({ navigation, userName }) => {
  return (
    <View style={styles.customHeader}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>MI PERFIL</Text>
        <Text style={styles.headerSubtitle}>{userName}</Text>
      </View>
      
      <TouchableOpacity style={styles.profileButton}>
        <LinearGradient
          colors={['#5CE1E6', '#00adb5']}
          style={styles.profileCircle}
        >
          <Text style={styles.profileInitial}>
            {userName.split(' ').map(n => n[0]).join('')}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
export default ProfileHeader;