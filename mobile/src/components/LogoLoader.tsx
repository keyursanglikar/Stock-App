import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface LogoLoaderProps {
  message?: string;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({
  message = 'Loading StockWise...',
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Subtle breathing pulse animation for the logo container
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous rotation for the outer glowing ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Text opacity pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Outer Rotating Dash Ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      />

      {/* Central Pulsing Brand Box */}
      <Animated.View
        style={[
          styles.logoBox,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={styles.logoIcon}>📦</Text>
      </Animated.View>

      {/* Brand Name */}
      <View style={styles.brandRow}>
        <Text style={styles.brandTitle}>
          Stock<Text style={{ color: '#FF7A00' }}>Wise</Text>
        </Text>
      </View>

      {/* Animated Status Message */}
      <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
        {message}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  outerRing: {
    position: 'absolute',
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 2.5,
    borderColor: '#FF7A00',
    borderStyle: 'dashed',
    opacity: 0.45,
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#FFF5EC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE0C2',
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 36,
  },
  brandRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A7A7A',
    marginTop: 6,
  },
});
