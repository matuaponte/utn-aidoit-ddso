import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { Text, useTheme, SegmentedButtons, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { usePedidos } from '../../../src/hooks/usePedidos';
import PedidoCard from '../../../src/components/PedidoCard';
import SkeletonCard from '../../../src/components/SkeletonCard';
import EmptyState from '../../../src/components/EmptyState';
import { RefreshControl } from 'react-native';

export default function PedidosScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  // 'cliente' o 'freelancer'
  const [rolActivo, setRolActivo] = useState('cliente');
  const [filtroEstado, setFiltroEstado] = useState('Activos');
  const estadosPosibles = ['Activos', 'En Revisión', 'Completados', 'Cancelados'];

  const { 
    data: pedidosResponse, 
    isLoading, 
    isError, 
    refetch, 
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePedidos(rolActivo, filtroEstado);

  const pedidos = pedidosResponse?.pages?.flatMap(page => page.data) || [];

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={{ padding: 16 }}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      );
    }
    if (isError) {
      return (
        <EmptyState 
          icon="alert-circle-outline" 
          title="Error al cargar" 
          subtitle="Hubo un problema al obtener los pedidos." 
          actionLabel="Reintentar" 
          onAction={() => refetch()} 
        />
      );
    }
    return (
      <EmptyState 
        icon="clipboard-text-outline" 
        title="Sin resultados" 
        subtitle={rolActivo === 'cliente' ? 'No tenés ninguna compra en este estado.' : 'No tenés ninguna venta en este estado.'}
        actionLabel={rolActivo === 'cliente' ? "Buscar servicios" : null}
        onAction={rolActivo === 'cliente' ? () => router.push('/explorar') : null}
      />
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Pedidos</Text>
        <SegmentedButtons
          value={rolActivo}
          onValueChange={setRolActivo}
          buttons={[
            { value: 'cliente', label: 'Mis Compras' },
            { value: 'freelancer', label: 'Mis Ventas' },
          ]}
          style={styles.segmented}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
          {estadosPosibles.map((estado) => (
            <Chip
              key={estado}
              selected={filtroEstado === estado}
              onPress={() => setFiltroEstado(estado)}
              style={styles.chip}
              mode={filtroEstado === estado ? 'flat' : 'outlined'}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por estado: ${estado}`}
              accessibilityState={{ selected: filtroEstado === estado }}
            >
              {estado}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PedidoCard 
            pedido={item} 
            isFreelancer={rolActivo === 'freelancer'}
            onPress={() => router.push(`/pedidos/${item.id}`)}
          />
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl 
            refreshing={isFetching && !isFetchingNextPage} 
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ margin: 20 }} color={theme.colors.primary} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  segmented: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  chipsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  list: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
