import React from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
      <SafeAreaInsetsContext.Consumer>
        {(insets) => {
          const topInset = insets?.top ?? (Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 44);
          const bottomInset = insets?.bottom ?? (Platform.OS === 'ios' ? 24 : 10);

          return (
            <View style={[
              styles.outerPaddingContainer,
              {
                paddingTop: Math.max(10, topInset),
                paddingBottom: Math.max(10, bottomInset),
              }
            ]}>
              {/* Signature StockWise 5px Border Frame */}
              <View style={styles.appBorderFrame}>
                <RootNavigator />
              </View>
            </View>
          );
        }}
      </SafeAreaInsetsContext.Consumer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerPaddingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10, // 10px padding before border on left & right
  },
  appBorderFrame: {
    flex: 1,
    borderWidth: 5,
    borderColor: '#FF7A00', // Signature StockWise Orange 5px border
    borderRadius: Platform.OS === 'ios' ? 32 : 24, // Matches iOS screen curvature
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
});
