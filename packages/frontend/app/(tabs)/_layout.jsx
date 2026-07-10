import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Platform } from 'react-native';
import GlobalHeader from '../../src/components/GlobalHeader';

/**
 * Layout principal para usuarios autenticados.
 * Renderiza el Bottom Tab Navigator.
 */
export default function TabsLayout() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tabs
        screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        header: () => <GlobalHeader />, // Usar header global
        headerShown: true, // Lo mostramos por defecto
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 70 : 60, // Más fino
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 5,
        },
        tabBarShowLabel: false, // Esconde el texto (shifting moderno)
      }}
    >
      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => <Icon name="format-list-checks" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <Icon name="magnify" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="crear-gig/index"
        options={{
          title: 'Vender',
          tabBarIcon: ({ color }) => <Icon name="plus-circle-outline" size={24} color={color} />,
        }}
      />
      {/* Ocultamos perfil de la barra de tabs pero mantenemos la ruta para el Drawer */}
      <Tabs.Screen
        name="perfil/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
    </View>
  );
}
