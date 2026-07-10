import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, Avatar } from 'react-native-paper';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellido, setApellido] = useState(user?.apellido || '');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert('Error', 'El nombre y apellido no pueden estar vacíos.');
      return;
    }

    if (passwordNueva && !passwordActual) {
      Alert.alert('Faltan datos', 'Para cambiar tu contraseña, debes ingresar la contraseña actual.');
      return;
    }

    setLoading(true);
    const { success, error } = await updateProfile(nombre, apellido, passwordActual || undefined, passwordNueva || undefined);
    setLoading(false);

    if (success) {
      Alert.alert('Perfil actualizado', 'Tus datos se guardaron correctamente.', [
        { text: 'OK', onPress: () => router.push('/explorar') }
      ]);
    } else {
      Alert.alert('Error', error || 'No se pudo actualizar el perfil.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Avatar.Text 
            size={80} 
            label={`${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()} 
            style={{ backgroundColor: theme.colors.primary }} 
            color={theme.colors.onPrimary} 
          />
          <Text variant="headlineSmall" style={styles.nameText}>Mis Datos Personales</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>{user?.email}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Apellido"
            value={apellido}
            onChangeText={setApellido}
            mode="outlined"
            style={styles.input}
          />

          <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8, fontWeight: 'bold' }}>Cambiar Contraseña</Text>

          <TextInput
            label="Contraseña Actual"
            value={passwordActual}
            onChangeText={setPasswordActual}
            mode="outlined"
            secureTextEntry
            placeholder="Requerida si vas a cambiarla"
            style={styles.input}
          />

          <TextInput
            label="Nueva Contraseña"
            value={passwordNueva}
            onChangeText={setPasswordNueva}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button 
            mode="contained" 
            onPress={handleSave} 
            loading={loading} 
            disabled={loading}
            style={styles.submitBtn}
          >
            Guardar Cambios
          </Button>
        </View>
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
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  nameText: {
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  form: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  submitBtn: {
    paddingVertical: 6,
    marginTop: 8,
  }
});
