import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, useTheme } from 'react-native-paper';
import { View } from 'react-native';

const UIContext = createContext(null);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI debe ser utilizado dentro de un UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('error'); // 'error' o 'success'

  const showError = useCallback((msg) => {
    setMessage(msg);
    setType('error');
    setVisible(true);
  }, []);

  const showSuccess = useCallback((msg) => {
    setMessage(msg);
    setType('success');
    setVisible(true);
  }, []);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <UIContext.Provider value={{ showError, showSuccess }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={5000} // 5 segundos
        style={{
          backgroundColor: type === 'error' ? theme.colors.error : '#4CAF50',
          zIndex: 9999, // Asegurar que esté por encima de todo
        }}
        action={{
          label: 'OK',
          textColor: '#FFF',
          onPress: () => {
            setVisible(false);
          },
        }}
        accessibilityLiveRegion="polite"
      >
        {message}
      </Snackbar>
    </UIContext.Provider>
  );
};
