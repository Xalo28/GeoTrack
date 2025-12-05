import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const FilterButtons = ({ activeFilter, setActiveFilter, pendingOrders }) => {
  const filters = [
    { key: 'all', label: 'TODAS' },
    { key: 'pending', label: 'PENDIENTES', badge: pendingOrders },
    { key: 'delivered', label: 'ENTREGADAS' },
  ];

  return (
    <View style={styles.filterContainer}>
      <Text style={styles.sectionTitle}>FILTRAR RUTAS</Text>
      <View style={styles.filterButtons}>
        {filters.map((filter) => (
          <TouchableOpacity 
            key={filter.key}
            style={[
              styles.filterButton, 
              activeFilter === filter.key && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            {filter.badge > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.badgeCount}>{filter.badge}</Text>
              </View>
            )}
            <Text style={[
              styles.filterButtonText,
              activeFilter === filter.key && styles.filterButtonTextActive
            ]}>{filter.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = {
  filterContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#5CE1E6',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a0a0c0',
  },
  filterButtonTextActive: {
    color: '#1a1a2e',
  },
  filterBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
};

export default FilterButtons;