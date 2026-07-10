import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton, Divider, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCategorias } from '../../../src/hooks/useCategorias';
import { useCrearGig } from '../../../src/hooks/useGigs';

export default function CrearGigScreen() {
  const theme = useTheme();
  const router = useRouter();

  const { data: categorias, isLoading: isLoadingCategorias } = useCategorias();
  const { mutateAsync: crearGig, isPending: isCreando } = useCrearGig();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  // Guardamos el ID de la categoría
  const [categoriaId, setCategoriaId] = useState(null);

  // Mínimo 1 paquete, máximo 3
  const [paquetes, setPaquetes] = useState([
    { id: 1, nombre: 'Básico', descripcion: '', precio: '', diasEntrega: '' }
  ]);

  const agregarPaquete = () => {
    if (paquetes.length < 3) {
      setPaquetes([
        ...paquetes,
        { id: Date.now(), nombre: '', descripcion: '', precio: '', diasEntrega: '' }
      ]);
    }
  };

  const eliminarPaquete = (id) => {
    if (paquetes.length > 1) {
      setPaquetes(paquetes.filter(p => p.id !== id));
    }
  };

  const updatePaquete = (id, field, value) => {
    setPaquetes(paquetes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleCrearGig = async () => {
    if (!nombre || !descripcion || !categoriaId) {
      Alert.alert('Faltan datos', 'Por favor, completá el título, descripción y elegí una categoría.');
      return;
    }

    // Validar paquetes
    const paquetesValidos = paquetes.map(p => ({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: parseFloat(p.precio),
      diasEntrega: parseInt(p.diasEntrega, 10)
    }));

    const invalido = paquetesValidos.some(p => !p.nombre || !p.descripcion || isNaN(p.precio) || isNaN(p.diasEntrega));
    if (invalido) {
      Alert.alert('Faltan datos', 'Asegurate de completar correctamente los datos de los paquetes (precios y días deben ser números).');
      return;
    }

    try {
      await crearGig({
        nombre,
        descripcion,
        categoriaId: parseInt(categoriaId, 10),
        paquetes: paquetesValidos,
      });
      Alert.alert('¡Éxito!', 'Gig publicado correctamente.');
      router.push('/explorar');
    } catch (e) {
      // El error se maneja globalmente
    }
  };

  if (isLoadingCategorias) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="headlineSmall" style={styles.title}>Publicá un nuevo servicio</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Detallá lo que ofrecés y creá paquetes a medida.</Text>

        <TextInput
          label="Título de tu servicio (Gig)"
          value={nombre}
          onChangeText={setNombre}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Descripción detallada"
          value={descripcion}
          onChangeText={setDescripcion}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8, fontWeight: 'bold' }}>Categoría</Text>
        <View style={styles.categoriesContainer}>
          {categorias?.map(cat => (
            <Button
              key={cat.id}
              mode={categoriaId === cat.id ? "contained" : "outlined"}
              onPress={() => setCategoriaId(cat.id)}
              style={styles.categoryBtn}
            >
              {cat.nombre}
            </Button>
          ))}
        </View>

        <Divider style={{ marginVertical: 24 }} />

        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Tus Paquetes de Servicio</Text>
        <Text variant="bodySmall" style={{ color: '#666', marginBottom: 16 }}>
          Podés ofrecer hasta 3 niveles distintos de tu servicio (ej. Básico, Estándar, Premium).
        </Text>

        {paquetes.map((p, index) => (
          <View key={p.id} style={styles.paqueteCard}>
            <View style={styles.paqueteHeader}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                Paquete {index + 1}
              </Text>
              {paquetes.length > 1 && (
                <IconButton 
                  icon="trash-can-outline" 
                  iconColor={theme.colors.error} 
                  size={20} 
                  onPress={() => eliminarPaquete(p.id)}
                  style={{ margin: 0 }}
                />
              )}
            </View>

            <TextInput
              label="Nombre del paquete (ej. Básico)"
              value={p.nombre}
              onChangeText={(val) => updatePaquete(p.id, 'nombre', val)}
              mode="outlined"
              style={styles.input}
              dense
            />
            
            <TextInput
              label="Descripción corta"
              value={p.descripcion}
              onChangeText={(val) => updatePaquete(p.id, 'descripcion', val)}
              mode="outlined"
              style={styles.input}
              dense
            />
            
            <View style={styles.row}>
              <TextInput
                label="Precio (USD)"
                value={p.precio}
                onChangeText={(val) => updatePaquete(p.id, 'precio', val)}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                dense
              />
              <TextInput
                label="Días de entrega"
                value={p.diasEntrega}
                onChangeText={(val) => updatePaquete(p.id, 'diasEntrega', val)}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, { flex: 1 }]}
                dense
              />
            </View>
          </View>
        ))}

        {paquetes.length < 3 && (
          <Button mode="outlined" icon="plus" onPress={agregarPaquete} style={{ marginBottom: 24 }}>
            Agregar otro paquete
          </Button>
        )}

        <Button 
          mode="contained" 
          onPress={handleCrearGig} 
          loading={isCreando} 
          disabled={isCreando}
          style={styles.submitBtn}
        >
          Publicar Gig
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    marginRight: 4,
    marginBottom: 4,
  },
  paqueteCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  paqueteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  submitBtn: {
    paddingVertical: 8,
    marginTop: 8,
  }
});
