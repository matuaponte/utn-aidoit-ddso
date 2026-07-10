import React from 'react';
import { View, StyleSheet, Modal, KeyboardAvoidingView, Platform, Pressable } from 'react-native';

export default function BottomModal({ visible, onDismiss, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.overlay}
      >
        {/* Fondo oscuro interactivo para cerrar al tocar fuera */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        
        {/* Contenedor del contenido (se auto-ajusta con el teclado) */}
        <View style={styles.content}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    maxHeight: '90%', // Por seguridad, para que no ocupe toda la pantalla
  }
});
