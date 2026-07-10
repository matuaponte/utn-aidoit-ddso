import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import dayjs from 'dayjs';

export default function ChatBubble({ mensaje, esMio }) {
  const theme = useTheme();

  return (
    <View style={[
      styles.container,
      esMio ? styles.mioContainer : styles.otroContainer
    ]}>
      <View style={[
        styles.bubble,
        esMio ? { backgroundColor: '#DCF8C6' } : { backgroundColor: '#FFFFFF' }
      ]}>
        <Text style={styles.mensaje}>{mensaje.mensaje}</Text>
        <Text style={styles.hora}>
          {dayjs(mensaje.enviado).format('HH:mm')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  mioContainer: {
    justifyContent: 'flex-end',
  },
  otroContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  mensaje: {
    fontSize: 15,
    color: '#000',
    marginBottom: 4,
  },
  hora: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
  }
});
