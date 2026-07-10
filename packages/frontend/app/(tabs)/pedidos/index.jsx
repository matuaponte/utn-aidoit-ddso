import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, useTheme, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { usePedidos } from '../../../src/hooks/usePedidos';
import PedidoCard from '../../../src/components/PedidoCard';

export default function PedidosScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  // 'cliente' o 'freelancer'
  const [rolActivo, setRolActivo] = useState('cliente');

  const { 
    data: pedidosResponse, 
    isLoading, 
    isError, 
    refetch, 
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePedidos(rolActivo);

  const pedidos = pedidosResponse?.pages?.flatMap(page => page.data) || [];

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {rolActivo === 'cliente' 
            ? 'No tenés ninguna compra activa.' 
            : 'No tenés ninguna venta todavía.'}
        </Text>
      </View>
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
      </View>

      {isLoading && !isFetchingNextPage ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={{ color: theme.colors.error }}>Error al cargar los pedidos.</Text>
        </View>
      ) : (
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
          refreshing={isFetching && !isFetchingNextPage}
          onRefresh={refetch}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ margin: 20 }} color={theme.colors.primary} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  segmented: {
    marginBottom: 8,
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
