import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import HelpScreenStyles from '../../styles/HelpScreenStyles';

const ContactItem = ({ item }) => (
  <TouchableOpacity 
    style={[HelpScreenStyles.contactItem, { backgroundColor: `${item.color}15` }]}
    onPress={item.action}
  >
    <LinearGradient
      colors={[item.color, `${item.color}CC`]}
      style={HelpScreenStyles.contactIconContainer}
    >
      <MaterialIcons name={item.icon} size={24} color="#FFFFFF" />
    </LinearGradient>

    <View style={HelpScreenStyles.contactItemContent}>
      <Text style={HelpScreenStyles.contactItemTitle}>{item.title}</Text>
      <Text style={[HelpScreenStyles.contactItemDescription, { color: item.color }]}>
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

export default ContactItem;
