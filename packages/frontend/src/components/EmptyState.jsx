import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EmptyState({ 
  icon = "file-search-outline", 
  title = "No hay resultados", 
  subtitle = "Intentá con otros filtros o términos de búsqueda.", 
  actionLabel, 
  onAction 
}) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name={icon} 
        size={80} 
        color={theme.colors.outline} 
        style={styles.icon}
      />
      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.outline }]}>
        {subtitle}
      </Text>
      {actionLabel && onAction && (
        <Button 
          mode="contained-tonal" 
          onPress={onAction} 
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 16,
  }
});
