import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('es');

const estadoConfig = {
  PENDIENTE: { color: '#FFA726', icon: 'clock-outline', label: 'Pendiente' },
  CONFIRMADO: { color: '#42A5F5', icon: 'check-circle-outline', label: 'En Progreso' },
  EN_REVISION: { color: '#AB47BC', icon: 'eye-outline', label: 'En Revisión' },
  ENTREGADO: { color: '#66BB6A', icon: 'check-all', label: 'Entregado' },
  CANCELADO: { color: '#EF5350', icon: 'close-circle-outline', label: 'Cancelado' },
};

export default function PedidoCard({ pedido, isFreelancer, onPress }) {
  const theme = useTheme();
  
  // Si soy freelancer, muestro los datos del cliente. Si soy cliente, muestro al freelancer.
  const otroUsuario = isFreelancer ? pedido.cliente : pedido.freelancer;
  const config = estadoConfig[pedido.estado] || estadoConfig.PENDIENTE;
  
  // Calcular días restantes si está en progreso
  const fechaCreacion = dayjs(pedido.fechaCreacion);
  let textoTiempo = fechaCreacion.fromNow();
  let alertaTiempo = false;

  if (pedido.estado === 'CONFIRMADO' && pedido.paquete) {
    const fechaLimite = fechaCreacion.add(pedido.paquete.diasEntrega, 'day');
    const diasRestantes = fechaLimite.diff(dayjs(), 'day');
    
    if (diasRestantes < 0) {
      textoTiempo = `Atrasado por ${Math.abs(diasRestantes)} días`;
      alertaTiempo = true;
    } else if (diasRestantes === 0) {
      textoTiempo = 'Se entrega HOY';
      alertaTiempo = true;
    } else {
      textoTiempo = `Quedan ${diasRestantes} días`;
    }
  }

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={36} 
              label={otroUsuario ? otroUsuario.nombre.substring(0,2).toUpperCase() : '??'} 
              style={{ backgroundColor: theme.colors.primaryContainer }}
              labelStyle={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}
            />
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>
                {otroUsuario ? `${otroUsuario.nombre} ${otroUsuario.apellido}` : 'Usuario'}
              </Text>
              <Text style={styles.rolLabel}>{isFreelancer ? 'Cliente' : 'Freelancer'}</Text>
            </View>
          </View>
          
          <Text style={styles.precio}>${pedido.precioAcordado?.toLocaleString()}</Text>
        </View>

        <View style={styles.gigInfo}>
          <Text style={styles.gigTitle} numberOfLines={1}>{pedido.gig?.titulo || 'Servicio'}</Text>
          <Text style={styles.paqueteName} numberOfLines={1}>Paquete: {pedido.paquete?.nombre}</Text>
        </View>

        <View style={styles.footer}>
          <Chip 
            icon={() => <MaterialCommunityIcons name={config.icon} size={16} color={config.color} />}
            style={{ backgroundColor: `${config.color}20` }}
            textStyle={{ color: config.color, fontWeight: 'bold', fontSize: 12 }}
          >
            {config.label}
          </Chip>

          <View style={styles.timeContainer}>
            <MaterialCommunityIcons 
              name={alertaTiempo ? 'alert-circle-outline' : 'calendar-clock'} 
              size={16} 
              color={alertaTiempo ? theme.colors.error : '#888'} 
            />
            <Text style={[styles.timeText, alertaTiempo && { color: theme.colors.error, fontWeight: 'bold' }]}>
              {textoTiempo}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userNameContainer: {
    marginLeft: 12,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  rolLabel: {
    fontSize: 12,
    color: '#888',
  },
  precio: {
    fontWeight: '900',
    fontSize: 18,
    color: '#333',
  },
  gigInfo: {
    marginBottom: 16,
  },
  gigTitle: {
    fontSize: 15,
    color: '#444',
  },
  paqueteName: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
});
