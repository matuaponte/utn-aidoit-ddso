import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDrawer } from '../context/DrawerContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter, usePathname } from 'expo-router';

export default function GlobalHeader() {
  const { openDrawer } = useDrawer();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Ocultar el GlobalHeader en pantallas de detalle (ej: /pedidos/3)
  if (pathname.match(/^\/pedidos\/\d+$/) || pathname.match(/^\/faq/) || pathname.match(/^\/contacto/)) {
    return null;
  }

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <IconButton 
        icon="menu" 
        size={28} 
        onPress={openDrawer}
        style={styles.menuBtn}
      />
      <View style={styles.logoWrapper}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    height: 90, // Un tamaño fijo razonable incluyendo insets (se ajustará dinámicamente arriba pero damos base)
    paddingBottom: 8,
  },
  menuBtn: {
    position: 'absolute',
    left: 4,
    bottom: 0, // Anclado abajo para alinear con el logo
    zIndex: 10,
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 40,
    paddingBottom: 4,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  }
});
