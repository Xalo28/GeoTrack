import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

// Importar componentes
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { AvatarSection } from '../components/profile/AvatarSection';
import { ProfileField } from '../components/profile/ProfileField';
import { StatCard } from '../components/profile/StatCard';
import { ModalRequest } from '../components/profile/ModalRequest';
import { styles } from '../components/profile/styles';

const ProfileScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalScale] = useState(new Animated.Value(0.5));
  const [modalOpacity] = useState(new Animated.Value(0));
  
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const profileInfo = {
    fullName: 'Juanito Lopez',
    email: 'juanito@geotrack.com',
    phone: '+51 987 654 321',
    driverId: 'DRV-2025-001',
    vehicle: 'Toyota Hilux - Placa ABC-123',
    status: 'Activo',
    joinDate: '15/01/2024',
    totalDeliveries: 342,
    rating: 4.8,
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar la foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const animateModalIn = () => {
    setModalVisible(true);
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
      setModalVisible(false);
    });
  };

  const confirmRequest = () => {
    animateModalOut();
    Alert.alert(
      'Solicitud Enviada',
      'Tu solicitud de cambios ha sido enviada al administrador. Te contactaremos pronto.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <ProfileHeader 
        navigation={navigation} 
        userName={profileInfo.fullName}
      />

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AvatarSection 
          profileImage={profileImage}
          onPickImage={pickImage}
          fullName={profileInfo.fullName}
          status={profileInfo.status}
        />

        <View style={styles.statsContainer}>
          <StatCard 
            icon="local-shipping" 
            label="Entregas" 
            value={profileInfo.totalDeliveries} 
            color="#5CE1E6"
          />
          <StatCard 
            icon="star" 
            label="Calificación" 
            value={profileInfo.rating} 
            color="#FFA726"
          />
          <StatCard 
            icon="date-range" 
            label="Desde" 
            value={profileInfo.joinDate} 
            color="#4ECB71"
          />
        </View>

        <View style={styles.profileSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info" size={20} color="#5CE1E6" />
            <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL</Text>
          </View>
          
          <View style={styles.profileFields}>
            <ProfileField 
              icon="person" 
              label="Nombre Completo" 
              value={profileInfo.fullName} 
            />
            <ProfileField 
              icon="email" 
              label="Correo Electrónico" 
              value={profileInfo.email} 
            />
            <ProfileField 
              icon="phone" 
              label="Teléfono" 
              value={profileInfo.phone} 
            />
            <ProfileField 
              icon="badge" 
              label="ID de Conductor" 
              value={profileInfo.driverId} 
            />
            <ProfileField 
              icon="directions-car" 
              label="Vehículo Asignado" 
              value={profileInfo.vehicle} 
            />
            <ProfileField 
              icon="location-on" 
              label="Zona de Operación" 
              value="Lima Metropolitana" 
              isLast={true}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={animateModalIn}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.editButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons name="edit" size={20} color="#FFFFFF" />
            <Text style={styles.editButtonText}>SOLICITAR CAMBIOS</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Para modificar tu información personal, debes solicitar los cambios al administrador del sistema.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <ModalRequest
        visible={modalVisible}
        modalScale={modalScale}
        modalOpacity={modalOpacity}
        onClose={animateModalOut}
        onConfirm={confirmRequest}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;