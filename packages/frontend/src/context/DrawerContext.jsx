import React, { createContext, useContext, useState } from 'react';
import DrawerMenu from '../components/DrawerMenu';

const DrawerContext = createContext();

export function DrawerProvider({ children }) {
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isDrawerVisible }}>
      {children}
      <DrawerMenu visible={isDrawerVisible} onClose={closeDrawer} />
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
