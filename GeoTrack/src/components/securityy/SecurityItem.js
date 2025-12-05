import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const getIconColor = (icon) => {
  switch(icon) {
    case 'vpn-key': return '#5CE1E6';
    case 'fingerprint': return '#4ECB71';
    case 'timer': return '#FFA726';
    case 'security': return '#9575CD';
    case 'history': return '#FF7043';
    case 'logout': return '#FF4444';
    default: return '#5CE1E6';
  }
};

export const SecurityItem = ({ 
  icon, 
  title, 
  subtitle, 
  action, 
  onPress, 
  isLast = false,
  isToggle = false,
  toggleValue,
  onToggleChange
}) => {
  const iconColor = getIconColor(icon);

  const renderAction = () => {
    if (isToggle) {
      return (
        <TouchableOpacity 
          style={[styles.biometricToggle, toggleValue && styles.biometricToggleActive]}
          onPress={onToggleChange}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleThumb, toggleValue && styles.toggleThumbActive]} />
        </TouchableOpacity>
      );
    }

    if (typeof action === 'string') {
      return (
        <>
          <Text style={styles.securityActionText}>{action}</Text>
          <MaterialIcons name="chevron-right" size={20} color="#a0a0c0" />
        </>
      );
    }

    return action;
  };

  return (
    <TouchableOpacity 
      style={[styles.securityItem, isLast && styles.securityItemLast]}
      onPress={!isToggle ? onPress : null}
      activeOpacity={0.7}
    >
      <View style={styles.securityItemContent}>
        <View style={[styles.securityIcon, { backgroundColor: `${iconColor}20` }]}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.securityTextContainer}>
          <Text style={styles.securityTitle}>{title}</Text>
          <Text style={styles.securitySubtitle}>{subtitle}</Text>
        </View>
      </View>
      {action && (
        <View style={styles.securityAction}>
          {renderAction()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = {
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  securityItemLast: {
    borderBottomWidth: 0,
  },
  securityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  securitySubtitle: {
    fontSize: 12,
    color: '#a0a0c0',
  },
  securityAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityActionText: {
    fontSize: 12,
    color: '#5CE1E6',
    fontWeight: 'bold',
    marginRight: 5,
  },
  biometricToggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
  },
  biometricToggleActive: {
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
};
export default SecurityItem;