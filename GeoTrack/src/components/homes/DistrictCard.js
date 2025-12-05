import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native'; // Animated de react-native
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const DistrictCard = ({ district, onPress, fadeAnim, slideAnim, pulseAnim }) => {
  return (
    <Animated.View 
      style={[
        styles.districtCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: pulseAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.districtCardContent}
        onPress={() => onPress(district)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['rgba(92, 225, 230, 0.1)', 'rgba(0, 173, 181, 0.05)']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.districtIcon}>
              <MaterialIcons name="location-on" size={24} color="#5CE1E6" />
            </View>
            <Text style={styles.districtName}>{district.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={[
                styles.statusText,
                { color: district.pending > 0 ? '#FF6B6B' : '#4ECB71' }
              ]}>
                {district.pending > 0 ? 'PENDIENTE' : 'COMPLETADO'}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialIcons name="check-circle" size={20} color="#4ECB71" />
              </View>
              <Text style={styles.statLabel}>Entregados</Text>
              <Text style={[styles.statValue, styles.deliveredText]}>{district.delivered}</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialIcons name="pending" size={20} color="#FFA726" />
              </View>
              <Text style={styles.statLabel}>Pendientes</Text>
              <Text style={[styles.statValue, styles.pendingText]}>{district.pending}</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialIcons name="assessment" size={20} color="#5CE1E6" />
              </View>
              <Text style={styles.statLabel}>Progreso</Text>
              <Text style={[styles.statValue, styles.progressText]}>{district.progress}%</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${district.progress}%`,
                    backgroundColor: district.progress === 100 ? '#4ECB71' : 
                                    district.progress >= 50 ? '#5CE1E6' : '#FFA726'
                  }
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {district.progress === 100 ? '✅ Ruta completada' : 
               district.progress >= 50 ? '⏳ En progreso' : '🚀 Por comenzar'}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => onPress(district)}
            activeOpacity={0.8}
          >
            <Text style={styles.viewDetailsText}>VER DETALLES DE LA RUTA</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = {
  districtCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  districtCardContent: {
    flex: 1,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  districtIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  districtName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 10,
    color: '#a0a0c0',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deliveredText: {
    color: '#4ECB71',
  },
  pendingText: {
    color: '#FFA726',
  },
  progressText: {
    color: '#5CE1E6',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5CE1E6',
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
};

export default DistrictCard;