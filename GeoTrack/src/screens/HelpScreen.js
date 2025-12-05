import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Platform,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import HelpScreenStyles from '../styles/HelpScreenStyles'; // Importa los estilos

const { width } = Dimensions.get('window');

const HelpScreen = ({ navigation }) => {
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const faqItems = [
    {
      id: 1,
      question: '¿Cómo escaneo un pedido?',
      answer: 'Ve al inicio y pulsa el botón "QR" o "Escanear". Enfoca el código de barras del paquete.',
      icon: 'qr-code-scanner',
      color: '#5CE1E6'
    },
    {
      id: 2,
      question: '¿Qué hago si no tengo internet?',
      answer: 'La app guardará los datos localmente y los subirá cuando recuperes conexión.',
      icon: 'wifi-off',
      color: '#5CE1E6'
    },
    {
      id: 3,
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve al menú > Seguridad > Cambiar Contraseña.',
      icon: 'vpn-key',
      color: '#5CE1E6'
    },
    {
      id: 4,
      question: '¿Cómo reportar un problema técnico?',
      answer: 'Contacta a soporte técnico a través del botón "Reportar Problema" o llamando al 01-800-GEOTRACK.',
      icon: 'report-problem',
      color: '#5CE1E6'
    },
    {
      id: 5,
      question: '¿La aplicación funciona en segundo plano?',
      answer: 'Sí, puedes seguir recibiendo notificaciones y actualizaciones mientras la app está en segundo plano.',
      icon: 'background',
      color: '#5CE1E6'
    },
    {
      id: 6,
      question: '¿Cómo actualizar mis datos personales?',
      answer: 'Ve al menú > Perfil > Editar Perfil para modificar tu información personal.',
      icon: 'person',
      color: '#5CE1E6'
    }
  ];

  const contactItems = [
    {
      id: 1,
      title: 'Llamada Telefónica',
      description: '01-800-GEOTRACK',
      icon: 'phone',
      color: '#5CE1E6',
      action: () => Linking.openURL('tel:01800GEOTRACK')
    },
    {
      id: 2,
      title: 'Correo Electrónico',
      description: 'soporte@geotrack.com',
      icon: 'email',
      color: '#FFA726',
      action: () => Linking.openURL('mailto:soporte@geotrack.com')
    },
    {
      id: 3,
      title: 'Chat en Vivo',
      description: 'Disponible 24/7',
      icon: 'chat',
      color: '#4ECB71',
      action: () => console.log('Abrir chat en vivo')
    }
  ];

  const FAQItem = ({ item, index }) => (
    <TouchableOpacity 
      style={[HelpScreenStyles.faqItem, index === 0 && HelpScreenStyles.faqItemFirst]}
      activeOpacity={0.9}
    >
      <View style={[HelpScreenStyles.faqIcon, { backgroundColor: `${item.color || '#5CE1E6'}20` }]}>
        <MaterialIcons name={item.icon} size={22} color={item.color || '#5CE1E6'} />
      </View>
      <View style={HelpScreenStyles.faqContent}>
        <Text style={HelpScreenStyles.question}>{item.question}</Text>
        <Text style={HelpScreenStyles.answer}>{item.answer}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#a0a0c0" />
    </TouchableOpacity>
  );

  const ContactItem = ({ item }) => (
    <TouchableOpacity 
      style={[HelpScreenStyles.contactItem, { backgroundColor: `${item.color}15` }]}
      onPress={item.action}
      activeOpacity={0.7}
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

  return (
    <SafeAreaView style={HelpScreenStyles.container}>
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={HelpScreenStyles.backgroundGradient}
      />

      {/* Header personalizado */}
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

      {/* Fecha */}
      <View style={HelpScreenStyles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={HelpScreenStyles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={HelpScreenStyles.scrollView}
        contentContainerStyle={HelpScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de soporte urgente */}
        <LinearGradient
          colors={['#5CE1E6', '#00adb5']}
          style={HelpScreenStyles.supportBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={HelpScreenStyles.supportBannerContent}>
            <MaterialIcons name="support-agent" size={40} color="#FFFFFF" />
            <View style={HelpScreenStyles.supportTextContainer}>
              <Text style={HelpScreenStyles.supportTitle}>¿Necesitas soporte urgente?</Text>
              <Text style={HelpScreenStyles.supportSubtitle}>Llama a la central:</Text>
              <TouchableOpacity 
                onPress={() => Linking.openURL('tel:01800GEOTRACK')}
                activeOpacity={0.8}
              >
                <Text style={HelpScreenStyles.supportPhone}>01-800-GEOTRACK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Tarjetas de contacto */}
        <Text style={HelpScreenStyles.sectionTitle}>CONTACTO RÁPIDO</Text>
        <View style={HelpScreenStyles.contactGrid}>
          {contactItems.map((item) => (
            <ContactItem key={item.id} item={item} />
          ))}
        </View>

        {/* Preguntas Frecuentes */}
        <View style={HelpScreenStyles.faqSection}>
          <View style={HelpScreenStyles.sectionHeader}>
            <MaterialIcons name="help" size={20} color="#5CE1E6" />
            <Text style={HelpScreenStyles.sectionTitle}>PREGUNTAS FRECUENTES</Text>
          </View>
          
          <View style={HelpScreenStyles.faqList}>
            {faqItems.map((item, index) => (
              <FAQItem key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>

        {/* Guía de uso */}
        <View style={HelpScreenStyles.guideSection}>
          <View style={HelpScreenStyles.sectionHeader}>
            <MaterialIcons name="book" size={20} color="#5CE1E6" />
            <Text style={HelpScreenStyles.sectionTitle}>GUÍA RÁPIDA</Text>
          </View>
          
          <View style={HelpScreenStyles.guideContainer}>
            <View style={HelpScreenStyles.guideStep}>
              <View style={HelpScreenStyles.guideNumber}>
                <Text style={HelpScreenStyles.guideNumberText}>1</Text>
              </View>
              <View style={HelpScreenStyles.guideContent}>
                <Text style={HelpScreenStyles.guideStepTitle}>Escaneo de Paquetes</Text>
                <Text style={HelpScreenStyles.guideStepDescription}>
                  Usa el escáner QR para registrar paquetes rápidamente
                </Text>
              </View>
            </View>
            
            <View style={HelpScreenStyles.guideStep}>
              <View style={HelpScreenStyles.guideNumber}>
                <Text style={HelpScreenStyles.guideNumberText}>2</Text>
              </View>
              <View style={HelpScreenStyles.guideContent}>
                <Text style={HelpScreenStyles.guideStepTitle}>Seguimiento en Tiempo Real</Text>
                <Text style={HelpScreenStyles.guideStepDescription}>
                  Monitorea la ubicación de tus envíos en tiempo real
                </Text>
              </View>
            </View>
            
            <View style={HelpScreenStyles.guideStep}>
              <View style={HelpScreenStyles.guideNumber}>
                <Text style={HelpScreenStyles.guideNumberText}>3</Text>
              </View>
              <View style={HelpScreenStyles.guideContent}>
                <Text style={HelpScreenStyles.guideStepTitle}>Reportes y Estadísticas</Text>
                <Text style={HelpScreenStyles.guideStepDescription}>
                  Genera reportes detallados de tu actividad
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Información de versión */}
        <View style={HelpScreenStyles.versionContainer}>
          <MaterialIcons name="code" size={18} color="#5CE1E6" />
          <Text style={HelpScreenStyles.versionText}>Versión 1.0.0 • Última actualización: Diciembre 2025</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};


export default HelpScreen;