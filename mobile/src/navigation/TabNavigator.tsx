import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLanguageStore } from '../state/languageStore';

import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ProductListScreen } from '../screens/stock/ProductListScreen';
import { ScanScreen } from '../screens/scan/ScanScreen';
import { AIReviewScreen } from '../screens/scan/AIReviewScreen';
import { QuickPOSScreen } from '../screens/billing/QuickPOSScreen';
import { AlertsInboxScreen } from '../screens/alerts/AlertsInboxScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ScanStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ScanCamera" component={ScanScreen} />
    <Stack.Screen name="AIReview" component={AIReviewScreen} />
  </Stack.Navigator>
);

const CustomScanTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.customScanButtonContainer}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.floatingScanCircle}>
      <Text style={styles.floatingScanPlus}>+</Text>
    </View>
  </TouchableOpacity>
);

export const AppTabNavigator: React.FC = () => {
  const { t } = useLanguageStore();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF7A00',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 74,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#ECECEC',
          elevation: 16,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        },
      }}
    >
      {/* 1. Left 1: Home */}
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: t.home,
          tabBarIcon: () => (
            <View style={styles.tabIconWrap}>
              <Text style={styles.tabEmoji}>🏠</Text>
            </View>
          ),
        }}
      />

      {/* 2. Left 2: Stock */}
      <Tab.Screen
        name="Stock"
        component={ProductListScreen}
        options={{
          tabBarLabel: t.stock,
          tabBarIcon: () => (
            <View style={styles.tabIconWrap}>
              <Text style={styles.tabEmoji}>📦</Text>
            </View>
          ),
        }}
      />

      {/* 3. Center: Scan (+) */}
      <Tab.Screen
        name="Scan"
        component={ScanStack}
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => <CustomScanTabBarButton {...props} />,
        }}
      />

      {/* 4. Right 1: Bills */}
      <Tab.Screen
        name="Bills"
        component={QuickPOSScreen}
        options={{
          tabBarLabel: t.bills,
          tabBarIcon: () => (
            <View style={styles.tabIconWrap}>
              <Text style={styles.tabEmoji}>⚡</Text>
            </View>
          ),
        }}
      />

      {/* 5. Right 2: Profile & Settings */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t.profile,
          tabBarIcon: () => (
            <View style={styles.tabIconWrap}>
              <Text style={styles.tabEmoji}>👤</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  tabEmoji: {
    fontSize: 22,
  },
  customScanButtonContainer: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  floatingScanCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FF7A00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4.5,
    borderColor: '#FFFFFF',
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 12,
  },
  floatingScanPlus: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '800',
    lineHeight: 34,
    marginTop: -2,
  },
});
