import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Image, KeyboardAvoidingView, Platform, Modal, Pressable, Dimensions } from 'react-native';
import { Text, useTheme, Card, Avatar, Divider, Button, TextInput } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGigDetail, useGigOpiniones } from '../../../src/hooks/useGigs';
import { useCrearPedido } from '../../../src/hooks/usePedidos';
import BottomModal from '../../../src/components/BottomModal';
import { useAuth } from '../../../src/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useUI } from '../../../src/context/UIContext';

const DEFAULT_COVER = 'https://picsum.photos/seed/gig/800/400';

export default function GigDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useUI();

  const { data: gig, isLoading: loadingGig, isError } = useGigDetail(id);
  const { data: opiniones, isLoading: loadingOpiniones } = useGigOpiniones(id);
  const { mutateAsync: crearPedido, isPending: isCreando } = useCrearPedido();

  // Estados del Checkout
  const [selectedPaquete, setSelectedPaquete] = React.useState(null);
  const [isCheckoutVisible, setCheckoutVisible] = React.useState(false);
  const [requerimientos, setRequerimientos] = React.useState('');

  React.useEffect(() => {
    if (gig?.paquetes?.length > 0 && !selectedPaquete) {
      const cheapest = gig.paquetes.reduce((prev, curr) => (prev.precio < curr.precio ? prev : curr));
      setSelectedPaquete(cheapest);
    }
  }, [gig]);

  const handleComprar = async () => {
    if (!selectedPaquete) return;
    try {
      await crearPedido({
        gigId: gig.id,
        paqueteId: selectedPaquete.id,
        requerimientos
      });
      setCheckoutVisible(false);
      showSuccess('Pedido creado con éxito');
      router.replace('/pedidos'); // Ir a mis pedidos
    } catch (error) {
      showError(error.response?.data?.message || 'Error al crear pedido');
    }
  };

  if (loadingGig) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError || !gig) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: theme.colors.error }}>Error al cargar el Gig.</Text>
      </View>
    );
  }

  const coverUrl = gig.multimedia && gig.multimedia.length > 0 && gig.multimedia[0].startsWith('http')
    ? gig.multimedia[0]
    : DEFAULT_COVER;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Cover Carousel */}
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.carouselContainer}
        >
          {[1, 2, 3].map((num) => (
            <Image 
              key={num}
              source={{ uri: `https://picsum.photos/seed/${gig.id}_${num}/800/400` }} 
              style={styles.coverImage} 
            />
          ))}
        </ScrollView>

        <View style={styles.content}>
          {/* Categoría y Título */}
          <Text variant="labelMedium" style={{ color: theme.colors.primary, marginBottom: 4 }}>
            {gig.categoria?.nombre?.toUpperCase()}
          </Text>
          <Text variant="headlineSmall" style={styles.title}>
            {gig.nombre}
          </Text>

          {/* Vendedor y Rating */}
          <View style={styles.vendedorRow}>
            <Avatar.Icon size={32} icon="account" style={{ backgroundColor: theme.colors.secondaryContainer }} />
            <View style={styles.vendedorInfo}>
              <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                {gig.vendedor?.nombre} {gig.vendedor?.apellido}
              </Text>
              <View style={styles.ratingRow}>
                <MaterialCommunityIcons name="star" size={16} color="#FFB300" />
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                  {gig.puntajePromedio.toFixed(1)} <Text style={{ color: '#888' }}>({gig.cantidadOpiniones} reseñas)</Text>
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Descripción */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Acerca de este servicio</Text>
          <Text variant="bodyMedium" style={styles.description}>
            {gig.descripcion}
          </Text>

          <Divider style={styles.divider} />

          {/* Paquetes */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Paquetes disponibles</Text>
          {gig.paquetes?.map((paquete) => {
            const isSelected = selectedPaquete?.id === paquete.id;
            return (
              <Card 
                key={paquete.id} 
                style={[
                  styles.paqueteCard, 
                  isSelected && { borderColor: theme.colors.primary, borderWidth: 2 }
                ]} 
                mode={isSelected ? "outlined" : "elevated"}
                onPress={() => setSelectedPaquete(paquete)}
              >
                <Card.Content>
                  <View style={styles.paqueteHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{paquete.nombre}</Text>
                    <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                      ${paquete.precio.toLocaleString()}
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={{ marginTop: 8, color: '#666' }}>
                    {paquete.descripcion}
                  </Text>
                  <View style={styles.paqueteFooter}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#888" />
                    <Text variant="labelSmall" style={{ color: '#888', marginLeft: 4 }}>
                      Entrega en {paquete.diasEntrega} {paquete.diasEntrega === 1 ? 'día' : 'días'}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            );
          })}

          <Divider style={styles.divider} />

          {/* Opiniones */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Opiniones de clientes</Text>
          {loadingOpiniones ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : opiniones && opiniones.data && opiniones.data.length > 0 ? (
            opiniones.data.map((op) => (
              <View key={op.id} style={styles.opinionContainer}>
                <View style={styles.opinionHeaderRow}>
                  <Avatar.Text 
                    size={32} 
                    label={op.usuario ? op.usuario.nombre.substring(0, 2).toUpperCase() : '??'} 
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                    labelStyle={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}
                  />
                  <View style={styles.opinionAuthorInfo}>
                    <Text variant="labelLarge" style={{ fontWeight: 'bold' }}>
                      {op.usuario ? `${op.usuario.nombre} ${op.usuario.apellido}` : 'Usuario'}
                    </Text>
                    <View style={styles.ratingRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <MaterialCommunityIcons 
                          key={i} 
                          name="star" 
                          size={12} 
                          color={i < op.puntuacion ? "#FFB300" : "#E0E0E0"} 
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text variant="labelSmall" style={styles.opinionFecha}>
                  {new Date(op.fecha).toLocaleDateString()}
                </Text>
                <Text variant="bodySmall" style={styles.opinionComentario}>{op.detalle}</Text>
              </View>
            ))
          ) : (
            <Text variant="bodyMedium" style={{ color: '#888', fontStyle: 'italic' }}>
              Aún no hay opiniones para este Gig.
            </Text>
          )}

        </View>
      </ScrollView>

      {/* Fixed Bottom Footer para el botón de compra principal */}
      {String(user?.id) !== String(gig.vendedorId) ? (
        <View style={[styles.bottomFooter, { backgroundColor: theme.colors.surface }]}>
          <Button 
            mode="contained" 
            style={styles.buyButton} 
            disabled={!selectedPaquete}
            onPress={() => setCheckoutVisible(true)}
          >
            {selectedPaquete ? `Pedir Paquete ${selectedPaquete.nombre}` : 'Seleccioná un paquete'}
          </Button>
        </View>
      ) : (
        <View style={[styles.bottomFooter, { backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>Estás viendo tu propio Gig</Text>
        </View>
      )}

      {/* Modal de Checkout */}
      <BottomModal visible={isCheckoutVisible} onDismiss={() => setCheckoutVisible(false)}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 16 }}>Confirmar Pedido</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text variant="bodyMedium">Paquete:</Text>
          <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{selectedPaquete?.nombre}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text variant="bodyMedium">Total a pagar:</Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            ${selectedPaquete?.precio.toLocaleString()}
          </Text>
        </View>

        <Text variant="labelMedium" style={{ marginBottom: 4 }}>Requerimientos para el freelancer:</Text>
        <View style={styles.textAreaContainer}>
          <TextInput 
            placeholder="Ej. 'Quiero un logo verde...'"
            value={requerimientos}
            onChangeText={setRequerimientos}
            style={{ height: 80, backgroundColor: '#FFF' }}
            disabled={isCreando}
            multiline
            mode="outlined"
          />
        </View>

        <View style={styles.modalActions}>
          <Button accessibilityRole="button" accessibilityLabel="Cancelar pedido" mode="text" onPress={() => setCheckoutVisible(false)} disabled={isCreando}>Cancelar</Button>
          <Button accessibilityRole="button" accessibilityLabel="Confirmar y pagar pedido" mode="contained" onPress={handleComprar} loading={isCreando} disabled={isCreando || !requerimientos.trim()}>
            Confirmar y Pagar
          </Button>
        </View>
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  carouselContainer: {
    height: 240,
  },
  coverImage: {
    width: Dimensions.get('window').width,
    height: 240,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  vendedorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vendedorInfo: {
    marginLeft: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  opinionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opinionAuthorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  divider: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    lineHeight: 22,
    color: '#444',
  },
  paqueteCard: {
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  paqueteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paqueteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  opinionContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  opinionComentario: {
    marginTop: 8,
    lineHeight: 20,
    color: '#333',
  },
  opinionFecha: {
    marginTop: 8,
    color: '#888',
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buyButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    elevation: 24,
  },
  textAreaContainer: {
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
