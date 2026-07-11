import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback, Animated, Alert } from 'react-native';
import { Text, useTheme, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export default function DrawerMenu({ visible, onClose }) {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateX, {
      toValue: -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlayContainer}>
        {/* Backdrop for closing when tapping outside */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={[
            styles.backdrop, 
            { 
              opacity: translateX.interpolate({
                inputRange: [-DRAWER_WIDTH, 0],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }) 
            }
          ]} />
        </TouchableWithoutFeedback>

        {/* The Actual Drawer */}
        <Animated.View style={[
          styles.drawer, 
          { 
            backgroundColor: theme.colors.surface, 
            paddingTop: insets.top,
            transform: [{ translateX: translateX }]
          }
        ]}>
          <View style={[styles.drawerHeader, { backgroundColor: theme.colors.primary }]}>
            <Avatar.Icon size={50} icon="account" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="#FFF" />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.nombre} {user?.apellido}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>

          {/* Menú de Opciones */}
          <View style={styles.menuContent}>        
            <TouchableOpacity style={styles.menuItem} onPress={() => { handleClose(); router.push('/perfil'); }}>
              <MaterialCommunityIcons name="account-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.menuText}>Datos Personales</Text>
            </TouchableOpacity>

            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Ayuda</Text>

            <TouchableOpacity style={styles.menuItem} onPress={() => { handleClose(); router.push('/faq'); }}>
              <MaterialCommunityIcons name="help-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.menuText}>Preguntas Frecuentes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { handleClose(); router.push('/contacto'); }}>
              <MaterialCommunityIcons name="message-text-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.menuText}>Canales de contacto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { 
              handleClose(); 
              Alert.alert(
                'Políticas de Cancelación', 
                'En AI Do It protegemos a ambas partes.\n\nComo Cliente:\nPodés cancelar tu pedido en cualquier momento mientras esté en progreso o en revisión. Los fondos se reembolsarán a tu cuenta.\n\nComo Freelancer:\nSi un pedido es cancelado antes de la entrega, se revisará la actividad para evitar abusos. Si considerás que una cancelación fue injusta, contactá a soporte.'
              ); 
            }}>
              <MaterialCommunityIcons name="shield-check-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.menuText}>Políticas de Cancelación</Text>
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => { handleClose(); Alert.alert('Apariencia', 'El modo oscuro estará disponible próximamente.'); }}>
              <MaterialCommunityIcons name="theme-light-dark" size={24} color={theme.colors.primary} />
              <Text style={styles.menuText}>Modo Oscuro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { handleClose(); logout(); }}>
              <MaterialCommunityIcons name="logout" size={24} color={theme.colors.error} />
              <Text style={styles.menuText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  drawerHeader: {
    padding: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#EEE',
    fontSize: 14,
  },
  menuContent: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 10,
  },
  sectionTitle: {
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
});
