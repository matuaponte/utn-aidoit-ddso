import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

export default function SkeletonCard() {
  const theme = useTheme();
  const animValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animValue]);

  const backgroundColor = theme.colors.surfaceVariant;

  return (
    <Card style={styles.card} mode="elevated">
      {/* Imagen */}
      <Animated.View style={[styles.imageSkeleton, { backgroundColor, opacity: animValue }]} />
      
      <Card.Content style={styles.content}>
        {/* Chips (Categoría) */}
        <Animated.View style={[styles.chipSkeleton, { backgroundColor, opacity: animValue }]} />
        
        {/* Título */}
        <Animated.View style={[styles.titleSkeleton, { backgroundColor, opacity: animValue }]} />
        <Animated.View style={[styles.titleSkeleton, { backgroundColor, opacity: animValue, width: '60%' }]} />
        
        {/* Footer (Precio y Vendedor) */}
        <View style={styles.footer}>
          <Animated.View style={[styles.avatarSkeleton, { backgroundColor, opacity: animValue }]} />
          <Animated.View style={[styles.priceSkeleton, { backgroundColor, opacity: animValue }]} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageSkeleton: {
    height: 160,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  chipSkeleton: {
    height: 24,
    width: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  titleSkeleton: {
    height: 18,
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  avatarSkeleton: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  priceSkeleton: {
    height: 24,
    width: 80,
    borderRadius: 4,
  }
});
