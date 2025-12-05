import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationItem = ({ notification, onToggle }) => {
  const getNotificationColor = (type) => {
    switch(type) {
      case 'delivery': return '#5CE1E6';
      case 'route': return '#4ECB71';
      case 'reminder': return '#FFA726';
      case 'system': return '#9575CD';
      default: return '#5CE1E6';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !notification.read && styles.notificationUnread
      ]}
      onPress={() => onToggle(notification.id)}
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
};

const styles = {
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
};

export default NotificationItem;