import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import HelpScreenStyles from '../../styles/HelpScreenStyles';

const SupportBanner = () => (
  <LinearGradient
    colors={['#5CE1E6', '#00adb5']}
    style={HelpScreenStyles.supportBanner}
  >
    <View style={HelpScreenStyles.supportBannerContent}>
      <MaterialIcons name="support-agent" size={40} color="#FFFFFF" />
      <View style={HelpScreenStyles.supportTextContainer}>
        <Text style={HelpScreenStyles.supportTitle}>¿Necesitas soporte urgente?</Text>
        <Text style={HelpScreenStyles.supportSubtitle}>Llama a la central:</Text>
        
        <TouchableOpacity onPress={() => Linking.openURL('tel:01800GEOTRACK')}>
          <Text style={HelpScreenStyles.supportPhone}>01-800-GEOTRACK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </LinearGradient>
);

export default SupportBanner;
