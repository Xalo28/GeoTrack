import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
  Modal,
  Animated,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ProfileScreenStyles from '../styles/ProfileScreenStyles'; // Importa los estilos

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalScale] = useState(new Animated.Value(0.5));
  const [modalOpacity] = useState(new Animated.Value(0));
  
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  // Información del perfil
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

  const handleRequestChanges = () => {
    animateModalIn();
  };

  const confirmRequest = () => {
    animateModalOut();
    Alert.alert(
      'Solicitud Enviada',
      'Tu solicitud de cambios ha sido enviada al administrador. Te contactaremos pronto.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const ProfileField = ({ icon, label, value, isLast = false }) => (
    <View style={[ProfileScreenStyles.fieldContainer, isLast && ProfileScreenStyles.fieldLast]}>
      <View style={ProfileScreenStyles.fieldIcon}>
        <MaterialIcons name={icon} size={22} color="#5CE1E6" />
      </View>
      <View style={ProfileScreenStyles.fieldContent}>
        <Text style={ProfileScreenStyles.fieldLabel}>{label}</Text>
        <Text style={ProfileScreenStyles.fieldValue}>{value}</Text>
      </View>
    </View>
  );

  const StatCard = ({ icon, label, value, color = '#5CE1E6' }) => (
    <View style={ProfileScreenStyles.statCard}>
      <LinearGradient
        colors={[`${color}20`, `${color}10`]}
        style={ProfileScreenStyles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={[ProfileScreenStyles.statIcon, { backgroundColor: `${color}20` }]}>
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
        <Text style={ProfileScreenStyles.statValue}>{value}</Text>
        <Text style={ProfileScreenStyles.statLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={ProfileScreenStyles.container}>
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={ProfileScreenStyles.backgroundGradient}
      />

      {/* Header personalizado */}
      <View style={ProfileScreenStyles.customHeader}>
        <TouchableOpacity 
          style={ProfileScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={ProfileScreenStyles.headerCenter}>
          <Text style={ProfileScreenStyles.headerTitle}>MI PERFIL</Text>
          <Text style={ProfileScreenStyles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <TouchableOpacity style={ProfileScreenStyles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={ProfileScreenStyles.profileCircle}
          >
            <Text style={ProfileScreenStyles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Fecha */}
      <View style={ProfileScreenStyles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={ProfileScreenStyles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={ProfileScreenStyles.scrollView}
        contentContainerStyle={ProfileScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar y foto de perfil */}
        <View style={ProfileScreenStyles.avatarSection}>
          <TouchableOpacity style={ProfileScreenStyles.avatarContainer} onPress={pickImage}>
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              style={ProfileScreenStyles.avatarGradient}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={ProfileScreenStyles.avatarImage} />
              ) : (
                <Text style={ProfileScreenStyles.avatarText}>JL</Text>
              )}
            </LinearGradient>
            <View style={ProfileScreenStyles.changePhotoButton}>
              <MaterialIcons name="camera-alt" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={ProfileScreenStyles.avatarName}>{profileInfo.fullName}</Text>
          <View style={ProfileScreenStyles.statusBadge}>
            <MaterialIcons name="circle" size={8} color="#4ECB71" />
            <Text style={ProfileScreenStyles.statusText}>{profileInfo.status}</Text>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={ProfileScreenStyles.statsContainer}>
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

        {/* Información del perfil */}
        <View style={ProfileScreenStyles.profileSection}>
          <View style={ProfileScreenStyles.sectionHeader}>
            <MaterialIcons name="info" size={20} color="#5CE1E6" />
            <Text style={ProfileScreenStyles.sectionTitle}>INFORMACIÓN PERSONAL</Text>
          </View>
          
          <View style={ProfileScreenStyles.profileFields}>
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

        {/* Botón Solicitar Cambios */}
        <TouchableOpacity 
          style={ProfileScreenStyles.editButton}
          onPress={handleRequestChanges}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={ProfileScreenStyles.editButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons name="edit" size={20} color="#FFFFFF" />
            <Text style={ProfileScreenStyles.editButtonText}>SOLICITAR CAMBIOS</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Información adicional */}
        <View style={ProfileScreenStyles.infoContainer}>
          <Text style={ProfileScreenStyles.infoText}>
            Para modificar tu información personal, debes solicitar los cambios al administrador del sistema.
          </Text>
        </View>

        {/* Espacio final */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal de confirmación */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <Animated.View style={[ProfileScreenStyles.modalOverlay, { opacity: modalOpacity }]}>
          <Animated.View style={[
            ProfileScreenStyles.modalContent,
            {
              transform: [{ scale: modalScale }],
              opacity: modalOpacity
            }
          ]}>
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              style={ProfileScreenStyles.modalIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="edit" size={40} color="#FFFFFF" />
            </LinearGradient>
            
            <Text style={ProfileScreenStyles.modalTitle}>Solicitar Cambios</Text>
            
            <Text style={ProfileScreenStyles.modalSubtitle}>
              Se enviará una solicitud formal al administrador para modificar tu información personal. ¿Deseas continuar?
            </Text>
            
            <View style={ProfileScreenStyles.modalButtons}>
              <TouchableOpacity 
                style={[ProfileScreenStyles.modalButton, ProfileScreenStyles.modalButtonSecondary]}
                onPress={animateModalOut}
              >
                <Text style={ProfileScreenStyles.modalButtonSecondaryText}>CANCELAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[ProfileScreenStyles.modalButton, ProfileScreenStyles.modalButtonPrimary]}
                onPress={confirmRequest}
              >
                <LinearGradient
                  colors={['#5CE1E6', '#00adb5']}
                  style={ProfileScreenStyles.modalButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={ProfileScreenStyles.modalButtonPrimaryText}>CONFIRMAR</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;