import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, List, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function FAQScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction onPress={() => router.back()} color="#FFF" />
        <Appbar.Content title="Preguntas Frecuentes" color="#FFF" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <List.Section>
          <List.Accordion
            title="¿Cómo comprar un servicio?"
            left={props => <List.Icon {...props} icon="cart-outline" />}
          >
            <List.Item titleNumberOfLines={4} title="Buscá el gig que te interesa en la pantalla Explorar, seleccioná un paquete (Básico, Estándar o Premium) y hacé clic en Continuar. Luego podrás enviar tus requerimientos." />
          </List.Accordion>

          <List.Accordion
            title="¿Cómo ofrecer un servicio?"
            left={props => <List.Icon {...props} icon="briefcase-outline" />}
          >
            <List.Item titleNumberOfLines={4} title="Andá a la pestaña Vender en la barra de navegación, completá el título, descripción y paquetes de tu gig. ¡Y listo! Estará disponible para todos los clientes." />
          </List.Accordion>

          <List.Accordion
            title="¿Cómo se pagan los servicios?"
            left={props => <List.Icon {...props} icon="credit-card-outline" />}
          >
            <List.Item titleNumberOfLines={4} title="Actualmente los pagos se coordinan directamente entre el freelancer y el cliente a través del chat de la plataforma, una vez confirmado el pedido." />
          </List.Accordion>
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
});
