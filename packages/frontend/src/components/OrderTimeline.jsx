import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const estadoConfig = {
  PENDIENTE: { color: '#FFA726', icon: 'clock-outline', label: 'Pendiente' },
  CONFIRMADO: { color: '#42A5F5', icon: 'check-circle-outline', label: 'En Progreso' },
  PENDIENTE_CAMBIOS: { color: '#42A5F5', icon: 'check-circle-outline', label: 'En Progreso' },
  EN_REVISION: { color: '#AB47BC', icon: 'eye-outline', label: 'En Revisión' },
  ENTREGADO: { color: '#66BB6A', icon: 'check-all', label: 'Entregado' },
  CANCELADO: { color: '#EF5350', icon: 'close-circle-outline', label: 'Cancelado' },
};

const STEPS = [
  { id: 'PENDIENTE', label: 'Pendiente' },
  { id: 'CONFIRMADO', label: 'En Progreso' },
  { id: 'EN_REVISION', label: 'En Revisión' },
  { id: 'ENTREGADO', label: 'Entregado' }
];

export default function OrderTimeline({ estado }) {
  const theme = useTheme();

  if (estado === 'CANCELADO') {
    return (
      <View style={[styles.cancelledBanner, { backgroundColor: estadoConfig.CANCELADO.color + '20', borderColor: estadoConfig.CANCELADO.color }]}>
        <MaterialCommunityIcons name={estadoConfig.CANCELADO.icon} size={24} color={estadoConfig.CANCELADO.color} />
        <Text style={[styles.cancelledText, { color: estadoConfig.CANCELADO.color }]}>Pedido Cancelado</Text>
      </View>
    );
  }

  // Mapear PENDIENTE_CAMBIOS al paso 2 (En Progreso) para la visualización
  const normalizedEstado = estado === 'PENDIENTE_CAMBIOS' ? 'CONFIRMADO' : estado;
  const currentIndex = STEPS.findIndex(s => s.id === normalizedEstado);

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isPending = index > currentIndex;
        
        let color = '#E0E0E0'; // Por defecto gris
        if (isActive) color = estadoConfig[step.id].color;
        else if (isCompleted) color = '#66BB6A'; // Verde para completados

        return (
          <View key={step.id} style={styles.stepContainer}>
            {/* Círculo */}
            <View style={[styles.circle, { backgroundColor: color, elevation: isActive ? 4 : 0 }]}>
              {isCompleted ? (
                <MaterialCommunityIcons name="check" size={16} color="#FFF" />
              ) : isActive ? (
                <View style={styles.innerDot} />
              ) : null}
            </View>
            
            {/* Etiqueta */}
            <Text style={[
              styles.label, 
              { color: isActive || isCompleted ? '#333' : '#999', fontWeight: isActive ? 'bold' : 'normal' }
            ]}>
              {step.label}
            </Text>

            {/* Línea conectora (excepto en el último paso) */}
            {index < STEPS.length - 1 && (
              <View style={[
                styles.line, 
                { backgroundColor: isCompleted ? '#66BB6A' : '#E0E0E0' }
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  line: {
    position: 'absolute',
    top: 11,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: 1,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  cancelledText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});
