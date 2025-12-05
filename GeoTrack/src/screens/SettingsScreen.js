import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  Dimensions,
  Modal,
  Animated,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import {
  SettingsHeader,
  SettingsOption,
  SettingsModal,
  ThemeModal,
  LanguageModal,
  OfflineModal
} from '../components/settingss';

const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {
  const [themeModal, setThemeModal] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [offlineModal, setOfflineModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('claro');
  const [selectedLanguage, setSelectedLanguage] = useState('español');
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [modalScale] = useState(new Animated.Value(0.5));
  const [modalOpacity] = useState(new Animated.Value(0));

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const animateModalIn = (modalType) => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    if (modalType === 'theme') setThemeModal(true);
    else if (modalType === 'language') setLanguageModal(true);
    else if (modalType === 'offline') setOfflineModal(true);
  };

  const animateModalOut = () => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 0.5,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setThemeModal(false);
      setLanguageModal(false);
      setOfflineModal(false);
    });
  };

  const Section = ({ title, icon, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name={icon} size={20} color="#5CE1E6" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.optionsList}>
        {children}
      </View>
    </View>
  );

  const DateDisplay = () => (
    <View style={styles.dateContainer}>
      <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
      <Text style={styles.dateText}>{formattedDate}</Text>
    </View>
  );

  const AppInfo = () => (
    <View style={styles.infoContainer}>
      <View style={styles.infoHeader}>
        <MaterialIcons name="info" size={18} color="#5CE1E6" />
        <Text style={styles.infoTitle}>Información de la Aplicación</Text>
      </View>
      <Text style={styles.infoText}>
        Versión 1.0.0{'\n'}
        © 2025 GeoTrack. Todos los derechos reservados.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <SettingsHeader navigation={navigation} />

      <DateDisplay />

      <ScrollView style={styles.content}>
        <Section title="GENERAL" icon="settings">
          <SettingsOption
            icon="language"
            label="Idioma"
            value={selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
            onPress={() => animateModalIn('language')}
            isFirst={true}
          />
          <SettingsOption
            icon={selectedTheme === 'oscuro' ? 'dark-mode' : 'light-mode'}
            label="Tema"
            value={selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
            onPress={() => animateModalIn('theme')}
            isLast={true}
          />
        </Section>

        <Section title="SINCRONIZACIÓN" icon="sync">
          <SettingsOption
            icon={offlineEnabled ? "wifi-off" : "wifi"}
            label="Modo Offline"
            value={offlineEnabled ? 'Activado' : 'Desactivado'}
            valueColor={offlineEnabled ? '#5CE1E6' : '#a0a0c0'}
            onPress={() => animateModalIn('offline')}
            isFirst={true}
            isLast={true}
          />
        </Section>

        <AppInfo />
      </ScrollView>

      <Modal
        visible={themeModal}
        transparent={true}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <SettingsModal 
          isVisible={themeModal} 
          modalScale={modalScale} 
          modalOpacity={modalOpacity}
        >
          <ThemeModal
            modalScale={modalScale}
            modalOpacity={modalOpacity}
            selectedTheme={selectedTheme}
            onSelectTheme={(theme) => {
              setSelectedTheme(theme);
              setTimeout(animateModalOut, 300);
            }}
            onClose={animateModalOut}
          />
        </SettingsModal>
      </Modal>

      <Modal
        visible={languageModal}
        transparent={true}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <SettingsModal 
          isVisible={languageModal} 
          modalScale={modalScale} 
          modalOpacity={modalOpacity}
        >
          <LanguageModal
            modalScale={modalScale}
            modalOpacity={modalOpacity}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(language) => {
              setSelectedLanguage(language);
              setTimeout(animateModalOut, 300);
            }}
            onClose={animateModalOut}
          />
        </SettingsModal>
      </Modal>

      <Modal
        visible={offlineModal}
        transparent={true}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <SettingsModal 
          isVisible={offlineModal} 
          modalScale={modalScale} 
          modalOpacity={modalOpacity}
        >
          <OfflineModal
            modalScale={modalScale}
            modalOpacity={modalOpacity}
            offlineEnabled={offlineEnabled}
            onToggleOffline={() => {
              setOfflineEnabled(!offlineEnabled);
              setTimeout(animateModalOut, 300);
            }}
            onClose={animateModalOut}
          />
        </SettingsModal>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 200 : 180,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(92, 225, 230, 0.3)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  optionsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#5CE1E6',
    marginBottom: 30,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#5CE1E6',
    lineHeight: 18,
  },
};

export default SettingsScreen;