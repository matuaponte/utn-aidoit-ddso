import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Searchbar, Chip, useTheme, Menu, IconButton } from 'react-native-paper';
import { useAuth } from '../../../src/context/AuthContext';
import { useGigs } from '../../../src/hooks/useGigs';
import { useCategorias } from '../../../src/hooks/useCategorias';
import GigCard from '../../../src/components/GigCard';
import { useDrawer } from '../../../src/context/DrawerContext';
import { Image } from 'react-native';

export default function ExplorarScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  
  // Estado local para los filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [categoriaId, setCategoriaId] = useState(null);
  const [ordenar, setOrdenar] = useState('fecha_desc');
  const [menuVisible, setMenuVisible] = useState(false);
  const { openDrawer } = useDrawer();

  // Debounce manual simple para la búsqueda
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Obtener datos vía React Query
  const { data: categoriasData } = useCategorias();
  const { 
    data: gigsData, 
    isLoading, 
    isFetchingNextPage, 
    fetchNextPage, 
    hasNextPage,
    isError,
    refetch 
  } = useGigs({
    q: debouncedQuery,
    categoriaId,
    ordenar,
  });

  // Aplanar las páginas del infinite scroll
  const gigs = useMemo(() => {
    if (!gigsData) return [];
    return gigsData.pages.flatMap(page => page.data);
  }, [gigsData]);

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={{ color: theme.colors.error }}>Ocurrió un error al cargar los Gigs.</Text>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          No se encontraron servicios.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* El header global ahora maneja el logo y menú, solo dejamos la barra de búsqueda localmente */}
      <View style={styles.header}>
        
        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Buscar servicios..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            elevation={1}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton 
                icon="sort-variant" 
                mode="contained-tonal"
                size={24} 
                onPress={() => setMenuVisible(true)} 
              />
            }
          >
            <Menu.Item onPress={() => { setOrdenar('fecha_desc'); setMenuVisible(false); }} title="Más recientes" />
            <Menu.Item onPress={() => { setOrdenar('precio_asc'); setMenuVisible(false); }} title="Menor precio" />
            <Menu.Item onPress={() => { setOrdenar('precio_desc'); setMenuVisible(false); }} title="Mayor precio" />
            <Menu.Item onPress={() => { setOrdenar('puntaje_desc'); setMenuVisible(false); }} title="Mejor evaluados" />
          </Menu>
        </View>

        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.chipsContainer}
          >
            <Chip 
              selected={categoriaId === null} 
              onPress={() => setCategoriaId(null)}
              style={[
                styles.chip,
                categoriaId === null ? { backgroundColor: theme.colors.primary } : { backgroundColor: '#E0E0E0' }
              ]}
              textStyle={{ color: categoriaId === null ? '#000' : '#333', fontWeight: 'bold' }}
              showSelectedCheck={false}
            >
              Todos
            </Chip>
            {categoriasData?.map(cat => {
              const isSelected = categoriaId === cat.id;
              return (
                <Chip 
                  key={cat.id} 
                  selected={isSelected} 
                  onPress={() => setCategoriaId(cat.id)}
                  style={[
                    styles.chip,
                    isSelected ? { backgroundColor: theme.colors.primary } : { backgroundColor: '#E0E0E0' }
                  ]}
                  textStyle={{ color: isSelected ? '#000' : '#333', fontWeight: 'bold' }}
                  showSelectedCheck={false}
                >
                  {cat.nombre}
                </Chip>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={gigs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <GigCard gig={item} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={{ margin: 16 }} color={theme.colors.primary} />
          ) : null
        }
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  searchbar: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  chipsContainer: {
    paddingBottom: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFF',
  },
  centerContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
