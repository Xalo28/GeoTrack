import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

const HelpScreen = ({ navigation }) => {
  const FAQItem = ({ question, answer }) => (
    <View style={styles.faqItem}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.answer}>{answer}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="AYUDA" showBack={true} />
      
      <ScrollView style={styles.content}>
        <View style={styles.contactCard}>
          <Ionicons name="headset" size={40} color="#FFF" />
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>¿Necesitas soporte urgente?</Text>
            <Text style={styles.contactSub}>Llama a la central: 01-800-GEOTRACK</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        
        <FAQItem 
          question="¿Cómo escaneo un pedido?"
          answer="Ve al inicio y pulsa el botón 'QR' o 'Escanear'. Enfoca el código de barras del paquete."
        />
        <FAQItem 
          question="¿Qué hago si no tengo internet?"
          answer="La app guardará los datos localmente y los subirá cuando recuperes conexión."
        />
        <FAQItem 
          question="¿Cómo cambio mi contraseña?"
          answer="Ve al menú > Seguridad > Cambiar Contraseña."
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20 },
  contactCard: {
    backgroundColor: '#5CE1E6', padding: 20, borderRadius: 15,
    flexDirection: 'row', alignItems: 'center', marginBottom: 30,
    shadowColor: '#5CE1E6', shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4, shadowRadius: 5, elevation: 5
  },
  contactText: { marginLeft: 15, flex: 1 },
  contactTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  contactSub: { color: '#FFF', fontSize: 14, marginTop: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  faqItem: { marginBottom: 20, backgroundColor: '#F9F9F9', padding: 15, borderRadius: 10 },
  question: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  answer: { fontSize: 14, color: '#666', lineHeight: 20 }
});

export default HelpScreen;