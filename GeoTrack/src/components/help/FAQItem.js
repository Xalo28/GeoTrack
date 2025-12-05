import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HelpScreenStyles from '../../styles/HelpScreenStyles';

const FAQItem = ({ item, index }) => (
  <TouchableOpacity 
    style={[HelpScreenStyles.faqItem, index === 0 && HelpScreenStyles.faqItemFirst]}
  >
    <View style={[HelpScreenStyles.faqIcon, { backgroundColor: `${item.color}20` }]}>
      <MaterialIcons name={item.icon} size={22} color={item.color} />
    </View>

    <View style={HelpScreenStyles.faqContent}>
      <Text style={HelpScreenStyles.question}>{item.question}</Text>
      <Text style={HelpScreenStyles.answer}>{item.answer}</Text>
    </View>

    <MaterialIcons name="chevron-right" size={20} color="#a0a0c0" />
  </TouchableOpacity>
);

export default FAQItem;
