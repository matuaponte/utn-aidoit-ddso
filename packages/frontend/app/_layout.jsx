import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme } from '../src/theme/theme';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { DrawerProvider } from '../src/context/DrawerContext';
import { UIProvider } from '../src/context/UIContext';
import SplashScreenComponent from '../src/components/SplashScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

/**
 * Root Layout para Expo Router.
 * Reemplaza al antiguo App.jsx.
 * 
 * Envuelve a toda la aplicación (`Slot`) con los Providers necesarios.
 * En la Fase 1, agregaremos acá la verificación de Auth para redireccionar
 * automáticamente a (auth) o (tabs).
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={lightTheme}>
          <AuthProvider>
            <UIProvider>
              <DrawerProvider>
                <RootLayoutNav />
              </DrawerProvider>
            </UIProvider>
          </AuthProvider>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

/**
 * Lógica interna de enrutamiento separada en un subcomponente
 * para poder usar el hook `useAuth()` (debe estar dentro de AuthProvider).
 */
function RootLayoutNav() {
  const { user, isLoading, sessionExpired } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    // Artificial delay for the Splash Screen animation to play
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || showSplash) return; // Esperamos al splash y a SecureStore

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      if (sessionExpired) {
        router.replace('/login?expired=true');
      } else {
        router.replace('/login');
      }
    } else if (user && inAuthGroup) {
      router.replace('/explorar');
    }
  }, [user, isLoading, sessionExpired, segments, showSplash]);


  if (isLoading || showSplash) {
    return <SplashScreenComponent />;
  }

  return <Slot />;
}
