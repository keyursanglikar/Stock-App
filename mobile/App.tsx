import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      {/* Outer padding container: 10px padding before the border */}
      <View style={styles.outerPaddingContainer}>
        {/* 5px Border Frame */}
        <View style={styles.appBorderFrame}>
          <RootNavigator />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerPaddingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10, // 10px padding before the border
    paddingTop: Platform.OS === 'android' ? 36 : 10, // Avoid notch overlap
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  appBorderFrame: {
    flex: 1,
    borderWidth: 5,
    borderColor: '#FF7A00', // Signature StockWise Orange 5px border
    borderRadius: 24,       // Clean modern rounded corners inside the outer padding
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
});
