import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useUI } from '../../src/context/UIContext';

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { register } = useAuth();
  const { showError } = useUI();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !password) {
      setError('Por favor completá todos los campos.');
      return;
    }
    if (!email.includes('@')) {
      setError('Por favor ingresá un formato de email válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setError('');
    setLoading(true);
    
    const result = await register(nombre, apellido, email, password);
    
    if (!result.success) {
      showError(result.error);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <Text style={styles.title}>
            <Text style={{ color: theme.colors.primary }}>AI</Text>
            <Text style={{ color: theme.colors.onSurface }}> Do It</Text>
          </Text>
          <Text style={styles.subtitle}>Unite a la red de AI Do It</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Nombre"
            mode="outlined"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            disabled={loading}
          />

          <TextInput
            label="Apellido"
            mode="outlined"
            value={apellido}
            onChangeText={setApellido}
            style={styles.input}
            disabled={loading}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            disabled={loading}
          />
          
          <TextInput
            label="Contraseña"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            disabled={loading}
          />

          {error ? (
            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          ) : null}

          <Button 
            mode="contained" 
            onPress={handleRegister} 
            loading={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Registrarse
          </Button>

          <View style={styles.footer}>
            <Text>¿Ya tenés cuenta?</Text>
            <Button 
              mode="text" 
              onPress={() => router.back()}
              disabled={loading}
            >
              Iniciá Sesión
            </Button>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#49454F',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
});
