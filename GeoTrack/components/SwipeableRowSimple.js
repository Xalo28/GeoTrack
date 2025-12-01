import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80; 
const ACTION_WIDTH = 80;

const SwipeableRowSimple = ({
  children,
  onDelete,
  onEdit,
  enabled = true,
  showLeftAction = false
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => enabled,
    onMoveShouldSetPanResponder: () => enabled,
    onPanResponderMove: (e, gestureState) => {
      // Solo permitir swipe horizontal
      if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
        // Limitar swipe a la izquierda (valores negativos)
        if (gestureState.dx < 0 && gestureState.dx > -ACTION_WIDTH * 2) {
          Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(
            e,
            gestureState
          );
        }
        // Limitar swipe a la derecha (valores positivos)
        else if (gestureState.dx > 0 && gestureState.dx < ACTION_WIDTH && showLeftAction) {
          Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(
            e,
            gestureState
          );
        }
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx < -SWIPE_THRESHOLD) {
        // Swipe a la izquierda suficiente - mostrar acciones
        Animated.spring(pan, {
          toValue: { x: -ACTION_WIDTH * 2, y: 0 },
          useNativeDriver: false,
          friction: 8,
        }).start();
        setShowDelete(true);
        setShowEdit(true);
      } else if (gestureState.dx > SWIPE_THRESHOLD && showLeftAction) {
        // Swipe a la derecha suficiente
        Animated.spring(pan, {
          toValue: { x: ACTION_WIDTH, y: 0 },
          useNativeDriver: false,
          friction: 8,
        }).start();
      } else {
        // Volver a posición original
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 8,
        }).start();
        setShowDelete(false);
        setShowEdit(false);
      }
    },
  });

  const handleDelete = () => {
    Animated.timing(pan, {
      toValue: { x: -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (onDelete) onDelete();
      // Resetear después de eliminar
      setTimeout(() => {
        pan.setValue({ x: 0, y: 0 });
        setShowDelete(false);
        setShowEdit(false);
      }, 100);
    });
  };

  const handleEdit = () => {
    if (onEdit) onEdit();
    // Cerrar después de editar
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 8,
    }).start(() => {
      setShowDelete(false);
      setShowEdit(false);
    });
  };

  const handleCloseActions = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 8,
    }).start(() => {
      setShowDelete(false);
      setShowEdit(false);
    });
  };

  return (
    <View style={styles.container}>
      {/* Acciones de fondo */}
      <View style={styles.backgroundActions}>
        {showLeftAction && (
          <TouchableOpacity
            style={[styles.leftAction, styles.markDeliveredAction]}
            onPress={() => {
              // Marcar como entregado
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
                friction: 8,
              }).start();
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            <Text style={styles.actionText}>Entregado</Text>
          </TouchableOpacity>
        )}

        <View style={styles.rightActions}>
          {showEdit && (
            <TouchableOpacity
              style={[styles.rightAction, styles.editAction]}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={20} color="#FFF" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
          )}

          {showDelete && (
            <TouchableOpacity
              style={[styles.rightAction, styles.deleteAction]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#FFF" />
              <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenido principal con animación */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}

        {/* Indicador de swipe (solo visible cuando no hay acciones) */}
        {!showDelete && !showEdit && (
          <View style={styles.swipeHint}>
            <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />
          </View>
        )}

        {/* Botón para cerrar acciones */}
        {(showDelete || showEdit) && (
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseActions}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray500} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: SPACING['2.5'],
    overflow: 'hidden',
  },
  backgroundActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  leftAction: {
    width: ACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: SPACING.borderRadius.DEFAULT,
    borderBottomLeftRadius: SPACING.borderRadius.DEFAULT,
  },
  rightActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  rightAction: {
    width: ACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: SPACING.borderRadius.DEFAULT,
    borderBottomRightRadius: SPACING.borderRadius.DEFAULT,
  },
  deleteAction: {
    backgroundColor: COLORS.danger,
  },
  editAction: {
    backgroundColor: COLORS.secondary,
  },
  markDeliveredAction: {
    backgroundColor: COLORS.success,
  },
  actionText: {
    color: '#FFF',
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginTop: SPACING['0.5'],
  },
  content: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.borderRadius.DEFAULT,
    zIndex: 2,
    ...SPACING.shadow.sm,
  },
  swipeHint: {
    position: 'absolute',
    right: SPACING['2'],
    top: '50%',
    marginTop: -8,
    opacity: 0.5,
  },
  closeButton: {
    position: 'absolute',
    right: SPACING['2'],
    top: SPACING['2'],
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
});

export default SwipeableRowSimple;