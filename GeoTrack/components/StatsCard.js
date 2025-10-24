import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatsCard = () => {
  const stats = [
    { number: '41', label: 'ENTREGADOS' },
    { number: '12', label: 'EN CAMINO' },
    { number: '53', label: 'PENDIENTES' },
  ];

  return (
    <View style={styles.statsCard}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
          {index < stats.length - 1 && <View style={styles.statDivider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#00ffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default StatsCard;