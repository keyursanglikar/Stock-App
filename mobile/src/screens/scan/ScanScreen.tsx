import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../../theme/colors';
import { Button } from '../../components/Button';
import { LogoLoader } from '../../components/LogoLoader';
import { apiClient } from '../../api/client';

export const ScanScreen: React.FC<any> = ({ navigation }) => {
  const [analyzing, setAnalyzing] = useState(false);

  const simulateRapidScan = async (mode: 'product_photo' | 'bill_photo') => {
    setAnalyzing(true);
    try {
      const res = await apiClient.post('/ai/extract/', {
        mode,
        image_url: 'https://stockwise-demo.s3.ap-south-1.amazonaws.com/samples/sample_tata_salt.jpg',
        image_hash: 'sample-sha256-hash-tata-salt',
      });

      // Poll or fetch status
      setTimeout(async () => {
        try {
          const jobRes = await apiClient.get(`/ai/jobs/${res.data.job_id}/`);
          setAnalyzing(false);
          navigation.navigate('AIReview', {
            jobId: res.data.job_id,
            aiData: jobRes.data.data,
          });
        } catch (err) {
          setAnalyzing(false);
          navigation.navigate('AIReview', {
            jobId: 'demo-job-id',
          });
        }
      }, 1500);
    } catch (e: any) {
      setTimeout(() => {
        setAnalyzing(false);
        navigation.navigate('AIReview', {
          jobId: 'demo-job-id',
        });
      }, 1500);
    }
  };

  if (analyzing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <LogoLoader message="AI Vision analyzing packaging photo..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewfinder}>
        <View style={styles.scanBox}>
          <Text style={styles.viewfinderText}>
            Point camera at Product or Supplier Bill
          </Text>
        </View>
      </View>

      <View style={styles.actionPanel}>
        <Text style={styles.tip}>Instant AI Extraction (under 10 seconds)</Text>
        <Button
          title="📸 Photograph Product"
          onPress={() => simulateRapidScan('product_photo')}
          style={{ marginBottom: 12 }}
        />
        <Button
          title="📄 Photograph Supplier Bill"
          variant="outline"
          onPress={() => simulateRapidScan('bill_photo')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 122, 0, 0.05)',
  },
  viewfinderText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  actionPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
  },
  tip: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
});
