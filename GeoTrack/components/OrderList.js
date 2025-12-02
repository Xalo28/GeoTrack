import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LogoContainer from './LogoContainer';
import styles from '../styles/PedidosStyles';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60; 
const DELETE_BUTTON_WIDTH = 80;

// Componente SwipeableRow para cada fila
const SwipeableRow = ({ children, onDelete, onOrderPress, order, isCalculating }) => {
  const pan = useState(new Animated.ValueXY())[0];
  const [showDelete, setShowDelete] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isCalculating,
    onMoveShouldSetPanResponder: () => !isCalculating,
    onPanResponderMove: (e, gestureState) => {
      // Solo permitir swipe hacia la izquierda (valores negativos)
      if (gestureState.dx < 0 && gestureState.dx > -DELETE_BUTTON_WIDTH) {
        Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(
          e,
          gestureState
        );
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx < -SWIPE_THRESHOLD) {
        // Swipe suficiente para mostrar botón de eliminar
        Animated.spring(pan, {
          toValue: { x: -DELETE_BUTTON_WIDTH, y: 0 },
          useNativeDriver: false,
          friction: 8,
        }).start();
        setShowDelete(true);
      } else {
        // Volver a posición original
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 8,
        }).start();
        setShowDelete(false);
      }
    },
  });

  const handleDelete = () => {
    // ✅ SOLO llamar a onDelete sin mostrar alerta aquí
    if (onDelete && order && order.id) {
      onDelete(order.id);
    }
    
    // Cerrar el swipe después de llamar a onDelete
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 8,
    }).start(() => {
      setShowDelete(false);
    });
  };

  const handleCloseSwipe = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 8,
    }).start(() => {
      setShowDelete(false);
    });
  };

  return (
    <View style={styles.swipeableContainer}>
      {/* Botón de eliminar (fondo) */}
      {showDelete && (
        <TouchableOpacity
          style={styles.deleteButtonBackground}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={24} color="#FFF" />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      )}

      {/* Contenido principal con animación */}
      <Animated.View
        style={[
          styles.swipeableContent,
          {
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}

        {/* Indicador de swipe (chevron) */}
        {!showDelete && !isCalculating && (
          <View style={styles.swipeHint}>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </View>
        )}

        {/* Botón para cerrar swipe */}
        {showDelete && (
          <TouchableOpacity style={styles.closeSwipeButton} onPress={handleCloseSwipe}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const OrderList = ({ 
  optimizedRoute, 
  ordersWithStableCoords, 
  isCalculatingRoute, 
  onOptimizeRoute, 
  onForceRecalculate, 
  onResetRoute,
  onOrderPress,
  onDeleteOrder,
  // NUEVAS PROPS PARA RUTAS GUARDADAS
  hasSavedRoute,
  onLoadSavedRoute,
  onOrderStatusUpdated
}) => {
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (orderId) => {
    setDeletingId(orderId);
    if (onDeleteOrder) {
      onDeleteOrder(orderId);
    }
    setTimeout(() => setDeletingId(null), 500);
  };

  // Si hay cambio de estado, forzar refresco
  useEffect(() => {
    if (onOrderStatusUpdated) {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 300);
    }
  }, [onOrderStatusUpdated]);

  // Función para obtener pedidos actualizados
  const getOrdersToDisplay = () => {
    if (optimizedRoute.length > 0) {
      return optimizedRoute;
    }
    return ordersWithStableCoords;
  };

  const orders = getOrdersToDisplay();

  return (
    <ScrollView 
      style={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            // Aquí podrías llamar a una función para refrescar datos
            setTimeout(() => setRefreshing(false), 1000);
          }}
          colors={['#5CE1E6']}
          tintColor="#5CE1E6"
        />
      }
    >
      <LogoContainer />
      
      {/* Instrucción para el usuario */}
      <View style={styles.instructionContainer}>
        <Ionicons name="information-circle-outline" size={18} color="#007AFF" />
        <Text style={styles.instructionText}>
          Desliza hacia la izquierda sobre un pedido para eliminarlo
        </Text>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={[styles.columnHeader, { flex: 0.15 }]}># Ruta</Text>
          <Text style={[styles.columnHeader, { flex: 0.55 }]}>Pedido</Text>
          <Text style={[styles.columnHeader, { flex: 0.15, textAlign: 'center' }]}>Dist.</Text>
          <Text style={[styles.columnHeader, { flex: 0.15, textAlign: 'center' }]}>Status</Text>
        </View>

        {orders.length > 0 ? (
          orders.map((order, index) => (
            <SwipeableRow
              key={`${order.id}-${index}-${order.estado}`} 
              onDelete={handleDelete}
              onOrderPress={() => onOrderPress(order)}
              order={order}
              isCalculating={isCalculatingRoute}
            >
              <OrderRow 
                order={order} 
                onPress={() => onOrderPress(order)}
                isOptimized={optimizedRoute.length > 0}
                index={index}
                isDeleting={deletingId === order.id}
              />
            </SwipeableRow>
          ))
        ) : (
          <EmptyList />
        )}

        {/* Botón para cargar ruta guardada (solo si hay ruta guardada y no hay ruta activa) */}
        {hasSavedRoute && optimizedRoute.length === 0 && ordersWithStableCoords.length > 0 && (
          <TouchableOpacity 
            style={[styles.enrutarButton, { backgroundColor: '#27ae60' }]}
            onPress={onLoadSavedRoute}
            disabled={isCalculatingRoute}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="download-outline" size={24} color="#FFF" style={{marginRight: 10}} />
              <Text style={styles.enrutarText}>CARGAR RUTA GUARDADA</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Botón de optimizar ruta */}
        <OptimizeButton 
          isCalculating={isCalculatingRoute}
          hasOrders={ordersWithStableCoords.length > 0}
          hasOptimizedRoute={optimizedRoute.length > 0}
          onPress={onOptimizeRoute}
        />

       

        {/* Acciones de ruta (solo si hay ruta optimizada activa) */}
        {optimizedRoute.length > 0 && (
          <View style={styles.routeSection}>
            <RouteActions 
              onRecalculate={onForceRecalculate}
              onReset={onResetRoute}
              isCalculating={isCalculatingRoute}
            />
            
            {/* Estadísticas de la ruta */}
            <RouteStats optimizedRoute={optimizedRoute} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const OrderRow = ({ order, onPress, isOptimized, index, isDeleting }) => {
  // Estado local para reflejar cambios inmediatos
  const [currentEstado, setCurrentEstado] = useState(order.estado);
  
  // Sincronizar con cambios externos
  useEffect(() => {
    setCurrentEstado(order.estado);
  }, [order.estado]);

  return (
    <TouchableOpacity 
      style={[
        styles.row, 
        isDeleting && { opacity: 0.5, backgroundColor: '#FFEBEE' },
        { 
          shadowColor: 'transparent',
          shadowOpacity: 0,
          elevation: 0,
        }
      ]} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <View style={[styles.routeNumber, { flex: 0.15 }]}>
          <ActivityIndicator size="small" color="#FF3B30" />
        </View>
      ) : isOptimized ? (
        <View style={[styles.routeNumber, { flex: 0.15 }]}>
          <Text style={styles.routeNumberText}>{order.orderInRoute || index + 1}</Text>
        </View>
      ) : (
        <Text style={[styles.cellText, { flex: 0.15, fontWeight: 'bold' }]}>{index + 1}</Text>
      )}
      
      <View style={{ flex: isOptimized ? 0.55 : 0.6 }}>
        <Text style={styles.clientText} numberOfLines={1}>
          {order.cliente || 'Cliente'}
        </Text>
        <Text style={styles.addressText} numberOfLines={2}>
          {order.informacionContacto?.direccion || order.direccion || 'Sin dirección'}
        </Text>
        <Text style={styles.districtText}>{order.distrito}</Text>
      </View>

      {isOptimized ? (
        <Text style={[styles.cellText, { flex: 0.15, textAlign: 'center', fontSize: 12 }]}>
          {order.distanceFromPrevious ? `${(order.distanceFromPrevious/1000).toFixed(1)}km` : '--'}
        </Text>
      ) : (
        <View style={{ flex: 0.15, alignItems: 'center' }} />
      )}

      <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center' }}>
        <StatusIcon estado={currentEstado} size={22} />
      </View>
    </TouchableOpacity>
  );
};

// StatusIcon actualizado - manejar minúsculas/mayúsculas
const StatusIcon = ({ estado, size }) => {
  // Normalizar el estado para comparación
  const normalizedEstado = estado?.toString().toLowerCase().trim();
  
  if (normalizedEstado === 'entregado') {
    return <Ionicons name="checkmark-circle" size={size} color="#27ae60" />;
  } else if (normalizedEstado === 'en camino' || normalizedEstado === 'encamino') {
    return <Ionicons name="car-outline" size={size} color="#f39c12" />;
  } else {
    // 'pendiente' o cualquier otro estado
    return <Ionicons name="time-outline" size={size} color="#5CE1E6" />;
  }
};

const EmptyList = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="document-text-outline" size={50} color="#ddd" />
    <Text style={styles.emptyText}>No hay pedidos en este distrito</Text>
  </View>
);

const OptimizeButton = ({ isCalculating, hasOrders, hasOptimizedRoute, onPress }) => (
  <TouchableOpacity 
    style={[styles.enrutarButton, isCalculating && styles.disabledButton]}
    onPress={onPress}
    disabled={isCalculating || !hasOrders}
  >
    {isCalculating ? (
      <ActivityIndicator color="#FFF" />
    ) : (
      <View style={styles.buttonContent}>
        <Ionicons name="navigate-outline" size={24} color="#FFF" style={{marginRight: 10}} />
        <Text style={styles.enrutarText}>
          {hasOptimizedRoute ? 'RUTA OPTIMIZADA' : 'OPTIMIZAR RUTA'}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const RouteActions = ({ onRecalculate, onReset, isCalculating }) => (
  <View style={styles.routeActionsContainer}>
    <TouchableOpacity 
      style={styles.recalculateButton}
      onPress={onRecalculate}
      disabled={isCalculating}
    >
      <Ionicons name="refresh-outline" size={18} color="#007AFF" style={{marginRight: 5}} />
      <Text style={styles.recalculateText}>Recalcular</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={styles.resetButton}
      onPress={onReset}
    >
      <Ionicons name="close-circle-outline" size={18} color="#FF3B30" style={{marginRight: 5}} />
      <Text style={styles.resetText}>Limpiar</Text>
    </TouchableOpacity>
  </View>
);

// Nuevo componente para mostrar estadísticas de la ruta
const RouteStats = ({ optimizedRoute }) => {
  const deliveredCount = optimizedRoute.filter(order => 
    order.estado?.toLowerCase() === 'entregado'
  ).length;
  
  const totalDistance = optimizedRoute.reduce((sum, order) => {
    return sum + (order.distanceFromPrevious || 0);
  }, 0);

 
};

export default OrderList;