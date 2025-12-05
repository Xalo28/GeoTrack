import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Importar componentes
import NotificationItem from '../components/notifications/NotificationItem';
import ToggleItem from '../components/notifications/ToggleItem';
import ScheduleOption from '../components/notifications/ScheduleOption';
import EmptyNotifications from '../components/notifications/EmptyNotifications';
import InfoBox from '../components/notifications/InfoBox';

const { width } = Dimensions.get('window');

const NotificationsScreen = ({ navigation }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationSchedule, setNotificationSchedule] = useState('instantly');
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nuevo Pedido Asignado',
      message: 'Tienes un nuevo pedido para entrega en Miraflores',
      time: 'Hace 5 minutos',
      read: false,
      type: 'delivery',
      icon: 'local-shipping'
    },
    {
      id: 2,
      title: 'Ruta Optimizada',
      message: 'Tu ruta ha sido optimizada para ahorrar 15 minutos',
      time: 'Hace 1 hora',
      read: true,
      type: 'route',
      icon: 'route'
    },
    {
      id: 3,
      title: 'Recordatorio de Entrega',
      message: 'El pedido #ORD-2025-342 está próximo a vencer',
      time: 'Hace 3 horas',
      read: true,
      type: 'reminder',
      icon: 'access-time'
    },
    {
      id: 4,
      title: 'Actualización del Sistema',
      message: 'Nueva versión 1.2.0 disponible con mejoras de rendimiento',
      time: 'Ayer, 14:30',
      read: true,
      type: 'system',
      icon: 'system-update'
    }
  ]);

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      Alert.alert('Error', 'Las notificaciones push solo funcionan en dispositivos físicos');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permiso denegado', 'No se pueden mostrar notificaciones sin permisos');
      setPushEnabled(false);
      return;
    }
  }

  const toggleNotification = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: !notification.read } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const clearAllNotifications = () => {
    Alert.alert(
      "Limpiar Notificaciones",
      "¿Estás seguro de que quieres eliminar todas las notificaciones?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpiar", 
          onPress: () => setNotifications([]),
          style: 'destructive'
        }
      ]
    );
  };

  const Header = () => (
    <View style={styles.customHeader}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>NOTIFICACIONES</Text>
        <Text style={styles.headerSubtitle}>JUANITO LOPEZ</Text>
      </View>
      
      <TouchableOpacity style={styles.profileButton}>
        <LinearGradient
          colors={['#5CE1E6', '#00adb5']}
          style={styles.profileCircle}
        >
          <Text style={styles.profileInitial}>JL</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const DateDisplay = () => (
    <View style={styles.dateContainer}>
      <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
      <Text style={styles.dateText}>{formattedDate}</Text>
    </View>
  );

  const NotificationsHeader = () => (
    <View style={styles.notificationsHeader}>
      <View style={styles.notificationsTitleContainer}>
        <MaterialIcons name="notifications" size={24} color="#5CE1E6" />
        <Text style={styles.notificationsTitle}>Notificaciones Recientes</Text>
      </View>
      <View style={styles.notificationsActions}>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Marcar como leídas</Text>
          </TouchableOpacity>
        )}
        {notifications.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearAllNotifications}>
            <MaterialIcons name="delete-outline" size={20} color="#FF4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const PreferencesSection = () => (
    <View style={styles.preferencesSection}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="settings" size={20} color="#5CE1E6" />
        <Text style={styles.sectionTitle}>PREFERENCIAS DE ALERTAS</Text>
      </View>
      
      <View style={styles.preferencesContainer}>
        <ToggleItem 
          icon="notifications" 
          title="Notificaciones Push" 
          subtitle="Alertas en tiempo real"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <ToggleItem 
          icon="email" 
          title="Alertas por Correo" 
          subtitle="Resúmenes diarios"
          value={emailEnabled}
          onValueChange={setEmailEnabled}
        />
        <ToggleItem 
          icon="sms" 
          title="Alertas SMS" 
          subtitle="Solo para emergencias"
          value={smsEnabled}
          onValueChange={setSmsEnabled}
        />
        <ToggleItem 
          icon="volume-up" 
          title="Sonidos de Alerta" 
          subtitle="Reproducir sonidos"
          value={soundsEnabled}
          onValueChange={setSoundsEnabled}
        />
        <ToggleItem 
          icon="vibration" 
          title="Vibración" 
          subtitle="Alertas táctiles"
          value={vibrationEnabled}
          onValueChange={setVibrationEnabled}
        />
      </View>

      <View style={styles.scheduleSection}>
        <Text style={styles.scheduleTitle}>Frecuencia de Alertas</Text>
        <View style={styles.scheduleOptions}>
          <ScheduleOption 
            title="Inmediatamente"
            value="instantly"
            isSelected={notificationSchedule === 'instantly'}
            onSelect={setNotificationSchedule}
          />
          <ScheduleOption 
            title="Cada 15 minutos"
            value="15min"
            isSelected={notificationSchedule === '15min'}
            onSelect={setNotificationSchedule}
          />
          <ScheduleOption 
            title="Cada hora"
            value="hourly"
            isSelected={notificationSchedule === 'hourly'}
            onSelect={setNotificationSchedule}
          />
          <ScheduleOption 
            title="Solo importantes"
            value="important"
            isSelected={notificationSchedule === 'important'}
            onSelect={setNotificationSchedule}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <Header />
      <DateDisplay />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NotificationsHeader />

        <View style={styles.notificationsList}>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                onToggle={toggleNotification}
              />
            ))
          ) : (
            <EmptyNotifications />
          )}
        </View>

        <PreferencesSection />
        <InfoBox />

        <View style={{ height: 30 }} />
      </ScrollView>
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
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  notificationsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  markAllButton: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5CE1E6',
  },
  clearButton: {
    padding: 6,
  },
  notificationsList: {
    marginBottom: 25,
  },
  preferencesSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  preferencesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  scheduleSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  scheduleOptions: {
    gap: 10,
  },
};

export default NotificationsScreen;