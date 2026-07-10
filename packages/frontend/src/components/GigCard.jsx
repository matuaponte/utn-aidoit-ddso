import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DEFAULT_COVER = 'https://picsum.photos/seed/gig/800/400';

export default function GigCard({ gig }) {
  const theme = useTheme();
  const router = useRouter();

  // Calcular precio base
  const precioBase = gig.paquetes && gig.paquetes.length > 0 
    ? Math.min(...gig.paquetes.map(p => p.precio))
    : 0;
  
  // Extraer imagen o usar dummy si la URL no es válida (ej. strings locas del seed)
  const coverUrl = gig.multimedia && gig.multimedia.length > 0 && gig.multimedia[0].startsWith('http')
    ? gig.multimedia[0]
    : DEFAULT_COVER;

  const handlePress = () => {
    router.push(`/explorar/${gig.id}`);
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
        <Card.Cover source={{ uri: coverUrl }} style={styles.cover} />
        
        <View style={styles.content}>
          {/* Header: Categoría y Vendedor */}
          <View style={styles.row}>
            <Text variant="labelSmall" style={[styles.category, { color: theme.colors.primary }]}>
              {gig.categoria?.nombre || 'Categoría'}
            </Text>
            <View style={styles.vendedorContainer}>
              <MaterialCommunityIcons name="shield-check" size={14} color="#4CAF50" />
              <Text variant="labelSmall" style={styles.vendedor}>
                {gig.vendedor?.nombre} {gig.vendedor?.apellido}
              </Text>
            </View>
          </View>

          {/* Título */}
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
            {gig.nombre}
          </Text>

          {/* Footer: Rating y Precio */}
          <View style={[styles.row, styles.footer]}>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFB300" />
              <Text variant="bodyMedium" style={styles.ratingText}>
                {gig.puntajePromedio.toFixed(1)} <Text style={styles.ratingCount}>({gig.cantidadOpiniones})</Text>
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text variant="labelSmall" style={styles.priceLabel}>DESDE</Text>
              <Text variant="titleMedium" style={styles.priceValue}>
                ${precioBase.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cover: {
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vendedorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vendedor: {
    color: '#666',
    fontWeight: '500',
  },
  title: {
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    marginBottom: 0,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '700',
  },
  ratingCount: {
    color: '#888',
    fontWeight: '400',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontWeight: 'bold',
  },
});
