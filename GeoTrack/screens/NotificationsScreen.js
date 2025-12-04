import React, { useState, useEffect, useRef } from 'react';
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
import NotificationsScreenStyles from '../styles/NotificationsScreenStyles'; // Importa los estilos

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
    <View style={NotificationsScreenStyles.toggleItem}>
      <View style={NotificationsScreenStyles.toggleInfo}>
        <View style={[NotificationsScreenStyles.toggleIcon, { backgroundColor: `${getNotificationColor('delivery')}20` }]}>
          <MaterialIcons name={icon} size={20} color={getNotificationColor('delivery')} />
        </View>
        <View style={NotificationsScreenStyles.toggleTextContainer}>
          <Text style={NotificationsScreenStyles.toggleTitle}>{title}</Text>
          {subtitle && <Text style={NotificationsScreenStyles.toggleSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <TouchableOpacity 
        style={[NotificationsScreenStyles.toggleSwitch, value && NotificationsScreenStyles.toggleActive]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={[NotificationsScreenStyles.toggleThumb, value && NotificationsScreenStyles.toggleThumbActive]} />
      </TouchableOpacity>
    </View>
  );

  const ScheduleOption = ({ title, value, isSelected, onSelect }) => (
    <TouchableOpacity 
      style={[NotificationsScreenStyles.scheduleOption, isSelected && NotificationsScreenStyles.scheduleOptionSelected]}
      onPress={() => onSelect(value)}
      activeOpacity={0.7}
    >
      <View style={NotificationsScreenStyles.scheduleRadio}>
        <View style={[NotificationsScreenStyles.scheduleRadioInner, isSelected && NotificationsScreenStyles.scheduleRadioSelected]} />
      </View>
      <Text style={[NotificationsScreenStyles.scheduleText, isSelected && NotificationsScreenStyles.scheduleTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity 
      style={[
        NotificationsScreenStyles.notificationItem,
        !notification.read && NotificationsScreenStyles.notificationUnread
      ]}
      onPress={() => toggleNotification(notification.id)}
      activeOpacity={0.7}
    >
      <View style={NotificationsScreenStyles.notificationContent}>
        <View style={[
          NotificationsScreenStyles.notificationIcon,
          { backgroundColor: `${getNotificationColor(notification.type)}20` }
        ]}>
          <MaterialIcons 
            name={notification.icon} 
            size={20} 
            color={getNotificationColor(notification.type)} 
          />
        </View>
        <View style={NotificationsScreenStyles.notificationText}>
          <View style={NotificationsScreenStyles.notificationHeader}>
            <Text style={NotificationsScreenStyles.notificationTitle}>{notification.title}</Text>
            {!notification.read && <View style={NotificationsScreenStyles.unreadDot} />}
          </View>
          <Text style={NotificationsScreenStyles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={NotificationsScreenStyles.notificationTime}>{notification.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={NotificationsScreenStyles.container}>
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={NotificationsScreenStyles.backgroundGradient}
      />

      {/* Header personalizado */}
      <View style={NotificationsScreenStyles.customHeader}>
        <TouchableOpacity 
          style={NotificationsScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={NotificationsScreenStyles.headerCenter}>
          <Text style={NotificationsScreenStyles.headerTitle}>NOTIFICACIONES</Text>
          <Text style={NotificationsScreenStyles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <TouchableOpacity style={NotificationsScreenStyles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={NotificationsScreenStyles.profileCircle}
          >
            <Text style={NotificationsScreenStyles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Fecha */}
      <View style={NotificationsScreenStyles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={NotificationsScreenStyles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={NotificationsScreenStyles.scrollView}
        contentContainerStyle={NotificationsScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contador de notificaciones */}
        <View style={NotificationsScreenStyles.notificationsHeader}>
          <View style={NotificationsScreenStyles.notificationsTitleContainer}>
            <MaterialIcons name="notifications" size={24} color="#5CE1E6" />
            <Text style={NotificationsScreenStyles.notificationsTitle}>Notificaciones Recientes</Text>
          </View>
          <View style={NotificationsScreenStyles.notificationsActions}>
            {unreadCount > 0 && (
              <TouchableOpacity style={NotificationsScreenStyles.markAllButton} onPress={markAllAsRead}>
                <Text style={NotificationsScreenStyles.markAllText}>Marcar como leídas</Text>
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity style={NotificationsScreenStyles.clearButton} onPress={clearAllNotifications}>
                <MaterialIcons name="delete-outline" size={20} color="#FF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista de notificaciones */}
        <View style={NotificationsScreenStyles.notificationsList}>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <View style={NotificationsScreenStyles.emptyState}>
              <MaterialIcons name="notifications-off" size={60} color="rgba(255, 255, 255, 0.2)" />
              <Text style={NotificationsScreenStyles.emptyTitle}>No hay notificaciones</Text>
              <Text style={NotificationsScreenStyles.emptySubtitle}>
                Cuando tengas nuevas alertas, aparecerán aquí
              </Text>
            </View>
          )}
        </View>

        {/* Sección de Preferencias */}
        <View style={NotificationsScreenStyles.preferencesSection}>
          <View style={NotificationsScreenStyles.sectionHeader}>
            <MaterialIcons name="settings" size={20} color="#5CE1E6" />
            <Text style={NotificationsScreenStyles.sectionTitle}>PREFERENCIAS DE ALERTAS</Text>
          </View>
          
          <View style={NotificationsScreenStyles.preferencesContainer}>
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

          {/* Configuración de frecuencia */}
          <View style={NotificationsScreenStyles.scheduleSection}>
            <Text style={NotificationsScreenStyles.scheduleTitle}>Frecuencia de Alertas</Text>
            <View style={NotificationsScreenStyles.scheduleOptions}>
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

        {/* Información de ayuda */}
        <View style={NotificationsScreenStyles.infoContainer}>
          <View style={NotificationsScreenStyles.infoHeader}>
            <MaterialIcons name="info" size={18} color="#5CE1E6" />
            <Text style={NotificationsScreenStyles.infoTitle}>Información importante</Text>
          </View>
          <Text style={NotificationsScreenStyles.infoText}>
            Recibirás notificaciones sobre nuevos pedidos asignados, cambios en tus rutas activas, 
            recordatorios de entrega y actualizaciones importantes del sistema.
          </Text>
          <Text style={NotificationsScreenStyles.infoNote}>
            Las notificaciones SMS solo se enviarán para alertas consideradas urgentes por el sistema.
          </Text>
        </View>

        {/* Espacio final */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;