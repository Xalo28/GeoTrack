import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const ActivityItem = ({ activity }) => (
  <View style={styles.activityItem}>
    <View style={[
      styles.activityIcon,
      { backgroundColor: activity.status === 'success' ? '#4ECB7120' : '#FF444420' }
    ]}>
      <MaterialIcons 
        name={activity.icon} 
        size={18} 
        color={activity.status === 'success' ? '#4ECB71' : '#FF4444'} 
      />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityAction}>{activity.action}</Text>
      <Text style={styles.activityDetails}>
        {activity.device} • {activity.location}
      </Text>
      <Text style={styles.activityTime}>{activity.time}</Text>
    </View>
  </View>
);

const styles = {
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  activityDetails: {
    fontSize: 11,
    color: '#a0a0c0',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 10,
    color: '#5CE1E6',
    fontWeight: '500',
  },
};
export default ActivityItem;