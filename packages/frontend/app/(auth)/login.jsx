import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useUI } from '../../src/context/UIContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { expired } = useLocalSearchParams();
  const theme = useTheme();
  const { login } = useAuth();
  const { showError } = useUI();

  const [email, setEmail] = useState('juan@mail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  // Email format validation (simple regex)
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password.length >= 6;

  const handleLogin = async () => {
    if (!isFormValid) return;
    
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (!result.success) {
      showError(result.error);
      setLoading(false);
    }
    // Si tiene éxito, el useEffect en _layout.jsx redirigirá automáticamente
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
          <Text style={styles.subtitle}>Tu plataforma de servicios freelance</Text>
        </View>

        <View style={styles.form}>
          {expired === 'true' && (
            <View style={styles.expiredBanner}>
              <MaterialCommunityIcons name="shield-alert-outline" size={20} color={theme.colors.error} style={styles.bannerIcon} />
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
            error={email.length > 0 && !isEmailValid}
          />
          <HelperText type="error" visible={email.length > 0 && !isEmailValid} style={{ marginTop: -8 }}>
            Formato de email inválido
          </HelperText>
          
          <TextInput
            label="Contraseña"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={hidePassword}
            style={styles.input}
            disabled={loading}
            right={<TextInput.Icon icon={hidePassword ? "eye" : "eye-off"} onPress={() => setHidePassword(!hidePassword)} />}
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
            disabled={loading || !isFormValid}
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
    padding: 24,
    paddingTop: 160,
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
