import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../state/authStore';

import { PhoneLoginScreen } from '../screens/auth/PhoneLoginScreen';
import { BusinessSetupScreen } from '../screens/auth/BusinessSetupScreen';
import { AppTabNavigator } from './TabNavigator';
import { LogoLoader } from '../components/LogoLoader';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, business } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Show smooth logo loader during initial app boot
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return <LogoLoader message="Initializing StockWise Engine..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={PhoneLoginScreen} />
        ) : !business ? (
          <Stack.Screen name="BusinessSetup" component={BusinessSetupScreen} />
        ) : (
          <Stack.Screen name="App" component={AppTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
