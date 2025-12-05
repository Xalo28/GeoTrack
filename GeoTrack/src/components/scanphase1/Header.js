import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({ onBackPress, title, subtitle, userName }) => {
  return (
    <View style={headerStyles.container}>
      <TouchableOpacity
        style={headerStyles.backButton}
        onPress={onBackPress}
      >
        <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={headerStyles.center}>
        <Text style={headerStyles.title}>{title}</Text>
        <Text style={headerStyles.subtitle}>{userName}</Text>
      </View>

      <TouchableOpacity style={headerStyles.profileButton}>
        <LinearGradient
          colors={['#5CE1E6', '#00adb5']}
          style={headerStyles.profileCircle}
        >
          <Text style={headerStyles.profileInitial}>
            {userName.split(' ').map(n => n[0]).join('')}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const headerStyles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
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
};

export default Header;