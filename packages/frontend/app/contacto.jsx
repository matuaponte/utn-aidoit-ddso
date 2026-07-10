import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, List, useTheme, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ContactoScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction onPress={() => router.back()} color="#FFF" />
        <Appbar.Content title="Canales de Contacto" color="#FFF" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Avatar.Icon size={80} icon="headset" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />
          <Text variant="headlineSmall" style={styles.title}>Estamos para ayudarte</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Elegí el medio que prefieras para comunicarte con el soporte de AI Do It.</Text>
        </View>

        <List.Section>
          <List.Item
            title="Correo Electrónico"
            description="soporte@aidoit.com"
            left={props => <List.Icon {...props} icon="email-outline" />}
            onPress={() => {}}
          />
          <List.Item
            title="Teléfono (Lunes a Viernes, 9 a 18hs)"
            description="0800-AIDOIT (243648)"
            left={props => <List.Icon {...props} icon="phone-outline" />}
            onPress={() => {}}
          />
          <List.Item
            title="WhatsApp"
            description="+54 9 11 1234-5678"
            left={props => <List.Icon {...props} icon="whatsapp" />}
            onPress={() => {}}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    paddingHorizontal: 20,
  }
});
