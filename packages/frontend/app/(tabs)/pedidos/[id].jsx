import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Text, useTheme, TextInput, IconButton, Appbar, Card, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePedidoDetail, useCambiarEstadoPedido, useMensajesPedido, useEnviarMensaje } from '../../../src/hooks/usePedidos';
import { useCrearOpinion } from '../../../src/hooks/useOpiniones';
import { useAuth } from '../../../src/context/AuthContext';
import ChatBubble from '../../../src/components/ChatBubble';
import BottomModal from '../../../src/components/BottomModal';

export default function PedidoDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  
  const [texto, setTexto] = useState('');

  // Estados para la Opinión
  const [opinionVisible, setOpinionVisible] = useState(false);
  const [puntaje, setPuntaje] = useState(5);
  const [comentario, setComentario] = useState('');

  const { mutateAsync: crearOpinion, isPending: isCreandoOpinion } = useCrearOpinion();

  const handleEnviarOpinion = async () => {
    if (puntaje < 1 || puntaje > 5) return;
    try {
      await crearOpinion({ pedidoId: id, puntuacion: puntaje, detalle: comentario });
      setOpinionVisible(false);
    } catch (e) {
      // Error manejado globalmente por apiClient
    }
  };

  // Obtener el pedido por ID de manera directa
  const { data: pedido, isLoading: isLoadingPedidos } = usePedidoDetail(id);
  
  // Hook para actualizar el estado del pedido
  const { mutateAsync: actualizarEstado } = useCambiarEstadoPedido();

  // Obtener mensajes de este pedido
  const { data: mensajes, isLoading: isLoadingMensajes } = useMensajesPedido(id);
  const { mutateAsync: enviarMensaje } = useEnviarMensaje(id);

  if (isLoadingPedidos) {
    return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  if (!pedido) {
    return <View style={styles.center}><Text>Pedido no encontrado</Text></View>;
  }

  const isFreelancer = pedido.freelancerId === user.id;

  const handleEnviar = async () => {
    if (!texto.trim()) return;
    await enviarMensaje({ mensaje: texto, pedidoId: id });
    setTexto('');
  };

  const confirmarAccion = (estado) => {
    Alert.alert(
      'Confirmar Acción',
      `¿Estás seguro de que deseas marcar este pedido como ${estado}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            await actualizarEstado({ pedidoId: pedido.id, nuevoEstado: estado });
          }
        }
      ]
    );
  };

  const renderActionBar = () => {
    if (pedido.estado === 'CANCELADO' || pedido.estado === 'ENTREGADO') return null;

    if (isFreelancer) {
      if (pedido.estado === 'PENDIENTE') {
        return (
          <View style={styles.actionBar}>
            <Button mode="contained" onPress={() => confirmarAccion('CONFIRMADO')} style={{flex:1, marginRight: 8}}>Aceptar</Button>
            <Button mode="outlined" textColor={theme.colors.error} onPress={() => confirmarAccion('CANCELADO')} style={{flex:1}}>Rechazar</Button>
          </View>
        );
      }
      if (pedido.estado === 'CONFIRMADO') {
        return (
          <View style={styles.actionBar}>
            <Button mode="contained" onPress={() => confirmarAccion('EN_REVISION')} style={{flex:1}}>Entregar Trabajo</Button>
          </View>
        );
      }
    } else {
      // Si es Cliente
      if (pedido.estado === 'EN_REVISION') {
        return (
          <View style={styles.actionBar}>
            <Button mode="contained" onPress={() => confirmarAccion('ENTREGADO')} style={{flex:1, marginRight:8}}>Aprobar Entrega</Button>
            <Button mode="outlined" onPress={() => confirmarAccion('CONFIRMADO')} style={{flex:1}}>Pedir Cambios</Button>
          </View>
        );
      }
      if (pedido.estado === 'PENDIENTE') {
        return (
          <View style={styles.actionBar}>
            <Button mode="outlined" textColor={theme.colors.error} onPress={() => confirmarAccion('CANCELADO')} style={{flex:1}}>Cancelar Pedido</Button>
          </View>
        );
      }
      if (pedido.estado === 'ENTREGADO') {
        return (
          <View style={styles.actionBar}>
            <Button mode="contained" onPress={() => setOpinionVisible(true)} style={{flex:1}}>Dejar Opinión</Button>
          </View>
        );
      }
    }
    return null;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Appbar.Header style={{ backgroundColor: '#FFF' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`Pedido #${pedido.id}`} subtitle={pedido.estado} />
      </Appbar.Header>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.gigTitle}>{pedido.gig?.titulo}</Text>
          <Text style={styles.paqueteName}>Paquete {pedido.paquete?.nombre} • ${pedido.precioAcordado}</Text>
          <Text style={styles.reqTitle}>Requerimientos del cliente:</Text>
          <Text style={styles.reqText}>{pedido.requerimientos}</Text>
        </Card.Content>
      </Card>

      {renderActionBar()}

      <View style={styles.chatContainer}>
        {isLoadingMensajes ? (
          <ActivityIndicator color={theme.colors.primary} style={{marginTop: 20}} />
        ) : (
          <FlatList
            data={mensajes ? [...mensajes].reverse() : []}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ChatBubble mensaje={item} esMio={String(item.usuarioId) === String(user.id)} />
            )}
            inverted={true}
            contentContainerStyle={styles.chatList}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribe un mensaje..."
          mode="outlined"
          style={styles.input}
          outlineColor="#CCC"
          activeOutlineColor={theme.colors.primary}
          multiline
        />
        <IconButton
          icon="send"
          iconColor="#FFF"
          containerColor={theme.colors.primary}
          size={24}
          onPress={handleEnviar}
          disabled={!texto.trim()}
        />
      </View>

      <BottomModal visible={opinionVisible} onDismiss={() => setOpinionVisible(false)}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 16 }}>Dejar Opinión</Text>
        
        <Text variant="bodyMedium" style={{ marginBottom: 8 }}>Puntaje (1 a 5 estrellas):</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IconButton
              key={star}
              icon={star <= puntaje ? "star" : "star-outline"}
              iconColor={theme.colors.primary}
              size={36}
              onPress={() => setPuntaje(star)}
              style={{ margin: 0 }}
            />
          ))}
        </View>

        <Text variant="labelMedium" style={{ marginBottom: 4 }}>Comentario:</Text>
        <TextInput 
          placeholder="¿Qué te pareció el trabajo?"
          value={comentario}
          onChangeText={setComentario}
          style={{ height: 80, backgroundColor: '#FFF', marginBottom: 16 }}
          disabled={isCreandoOpinion}
          multiline
          mode="outlined"
        />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
          <Button mode="text" onPress={() => setOpinionVisible(false)} disabled={isCreandoOpinion}>Cancelar</Button>
          <Button mode="contained" onPress={handleEnviarOpinion} loading={isCreandoOpinion} disabled={isCreandoOpinion || !comentario.trim()}>
            Enviar Opinión
          </Button>
        </View>
      </BottomModal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5', // Color de fondo clásico de WhatsApp
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    margin: 12,
    backgroundColor: '#FFF',
  },
  gigTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paqueteName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reqTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 8,
  },
  reqText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  chatContainer: {
    flex: 1,
  },
  chatList: {
    padding: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFF',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    maxHeight: 100,
    marginRight: 8,
  }
});
