import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { expired } = useLocalSearchParams();
  const theme = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState('juan@mail.com'); // Valor por defecto del Seed
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completá todos los campos.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
    // Si tiene éxito, el useEffect en _layout.jsx redirigirá automáticamente
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>AI Do It</Text>
          <Text style={styles.subtitle}>Tu plataforma de servicios freelance</Text>
        </View>

        <View style={styles.form}>
          {expired === 'true' && (
            <View style={styles.expiredBanner}>
              <MaterialCommunityIcons name="shield-alert-outline" size={20} color="#E65100" style={styles.bannerIcon} />
              <Text style={styles.expiredText}>
                Tu sesión ha expirado. Por favor, iniciá sesión nuevamente para continuar.
              </Text>
            </View>
          )}

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
            onPress={handleLogin} 
            loading={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Iniciar Sesión
          </Button>

          <View style={styles.footer}>
            <Text>¿No tenés cuenta?</Text>
            <Button 
              mode="text" 
              onPress={() => router.push('/register')}
              disabled={loading}
            >
              Registrate
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
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
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
  expiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFB300',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  bannerIcon: {
    marginRight: 10,
  },
  expiredText: {
    color: '#664D03',
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
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
