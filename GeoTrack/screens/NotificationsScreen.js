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

  const getNotificationColor = (type) => {
    switch(type) {
      case 'delivery': return '#5CE1E6';
      case 'route': return '#4ECB71';
      case 'reminder': return '#FFA726';
      case 'system': return '#9575CD';
      default: return '#5CE1E6';
    }
  };

  const ToggleItem = ({ icon, title, subtitle, value, onValueChange }) => (
    <View style={styles.toggleItem}>
      <View style={styles.toggleInfo}>
        <View style={[styles.toggleIcon, { backgroundColor: `${getNotificationColor('delivery')}20` }]}>
          <MaterialIcons name={icon} size={20} color={getNotificationColor('delivery')} />
        </View>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleTitle}>{title}</Text>
          {subtitle && <Text style={styles.toggleSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.toggleSwitch, value && styles.toggleActive]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </TouchableOpacity>
    </View>
  );

  const ScheduleOption = ({ title, value, isSelected, onSelect }) => (
    <TouchableOpacity 
      style={[styles.scheduleOption, isSelected && styles.scheduleOptionSelected]}
      onPress={() => onSelect(value)}
      activeOpacity={0.7}
    >
      <View style={styles.scheduleRadio}>
        <View style={[styles.scheduleRadioInner, isSelected && styles.scheduleRadioSelected]} />
      </View>
      <Text style={[styles.scheduleText, isSelected && styles.scheduleTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !notification.read && styles.notificationUnread
      ]}
      onPress={() => toggleNotification(notification.id)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={[
          styles.notificationIcon,
          { backgroundColor: `${getNotificationColor(notification.type)}20` }
        ]}>
          <MaterialIcons 
            name={notification.icon} 
            size={20} 
            color={getNotificationColor(notification.type)} 
          />
        </View>
        <View style={styles.notificationText}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

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

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.notificationsList}>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="notifications-off" size={60} color="rgba(255, 255, 255, 0.2)" />
              <Text style={styles.emptyTitle}>No hay notificaciones</Text>
              <Text style={styles.emptySubtitle}>
                Cuando tengas nuevas alertas, aparecerán aquí
              </Text>
            </View>
          )}
        </View>

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

        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={18} color="#5CE1E6" />
            <Text style={styles.infoTitle}>Información importante</Text>
          </View>
          <Text style={styles.infoText}>
            Recibirás notificaciones sobre nuevos pedidos asignados, cambios en tus rutas activas, 
            recordatorios de entrega y actualizaciones importantes del sistema.
          </Text>
          <Text style={styles.infoNote}>
            Las notificaciones SMS solo se enviarán para alertas consideradas urgentes por el sistema.
          </Text>
        </View>

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
  notificationItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  notificationUnread: {
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.2)',
  },
  notificationContent: {
    flexDirection: 'row',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5CE1E6',
    marginLeft: 5,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 5,
    lineHeight: 16,
  },
  notificationTime: {
    fontSize: 10,
    color: '#5CE1E6',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    paddingHorizontal: 30,
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
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleItemLast: {
    borderBottomWidth: 0,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#a0a0c0',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#5CE1E6',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
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
  scheduleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  scheduleOptionSelected: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  scheduleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#a0a0c0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  scheduleRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  scheduleRadioSelected: {
    backgroundColor: '#5CE1E6',
  },
  scheduleText: {
    fontSize: 14,
    color: '#a0a0c0',
    flex: 1,
  },
  scheduleTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#5CE1E6',
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
    marginBottom: 8,
  },
  infoNote: {
    fontSize: 11,
    color: '#5CE1E6',
    fontStyle: 'italic',
  },
};

export default NotificationsScreen;