import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import HelpScreenStyles from '../../styles/HelpScreenStyles';

const HeaderHelp = ({ navigation }) => (
  <View style={HelpScreenStyles.customHeader}>
    <TouchableOpacity 
      style={HelpScreenStyles.backButton}
      onPress={() => navigation.goBack()}
    >
      <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
    </TouchableOpacity>
    
    <View style={HelpScreenStyles.headerCenter}>
      <Text style={HelpScreenStyles.headerTitle}>AYUDA</Text>
      <Text style={HelpScreenStyles.headerSubtitle}>JUANITO LOPEZ</Text>
    </View>
    
    <TouchableOpacity style={HelpScreenStyles.profileButton}>
      <LinearGradient
        colors={['#5CE1E6', '#00adb5']}
        style={HelpScreenStyles.profileCircle}
      >
        <Text style={HelpScreenStyles.profileInitial}>JL</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

export default HeaderHelp;
