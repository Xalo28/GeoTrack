import React from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { faqItems, contactItems } from '../constants/helpData';
import HelpScreenStyles from '../styles/HelpScreenStyles';

// Componentes
import HeaderHelp from '../components/help/HeaderHelp';
import SupportBanner from '../components/help/SupportBanner';
import ContactItem from '../components/help/ContactItem';
import FAQItem from '../components/help/FAQItem';
import GuideSteps from '../components/help/GuideSteps';

const HelpScreen = ({ navigation }) => {
  const formattedDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).toUpperCase();

  return (
    <SafeAreaView style={HelpScreenStyles.container}>
      <HeaderHelp navigation={navigation} />

      <View style={HelpScreenStyles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={HelpScreenStyles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView contentContainerStyle={HelpScreenStyles.scrollContent}>

        <SupportBanner />

        <Text style={HelpScreenStyles.sectionTitle}>CONTACTO RÁPIDO</Text>
        <View style={HelpScreenStyles.contactGrid}>
          {contactItems.map((item) => <ContactItem key={item.id} item={item} />)}
        </View>

        <View style={HelpScreenStyles.faqSection}>
          <Text style={HelpScreenStyles.sectionTitle}>PREGUNTAS FRECUENTES</Text>
          {faqItems.map((item, index) => (
            <FAQItem key={item.id} item={item} index={index} />
          ))}
        </View>

        <View style={HelpScreenStyles.guideSection}>
          <Text style={HelpScreenStyles.sectionTitle}>GUÍA RÁPIDA</Text>
          <GuideSteps />
        </View>

        <Text style={HelpScreenStyles.versionText}>
          Versión 1.0.0 • Última actualización: Diciembre 2025
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpScreen;
