import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../../theme/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../state/authStore';

const BUSINESS_TYPES = [
  { id: 'kirana', label: 'Kirana & Grocery' },
  { id: 'medical', label: 'Medical & Pharmacy' },
  { id: 'hardware', label: 'Hardware Store' },
  { id: 'cafe', label: 'Cafe & Bakery' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'distributor', label: 'Wholesale / Distributor' },
];

export const BusinessSetupScreen: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [selectedType, setSelectedType] = useState('kirana');
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const { setBusiness } = useAuthStore();

  const handleSetup = async () => {
    if (!businessName.trim()) {
      Alert.alert('Required', 'Please enter your shop or business name.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/business/setup/', {
        business_name: businessName,
        business_type: selectedType,
        gstin: gstin.toUpperCase(),
        state_code: gstin.length >= 2 ? gstin.substring(0, 2) : '27',
      });
      setBusiness(res.data.business);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to setup business.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Setup Your Shop</Text>
        <Text style={styles.subtitle}>
          Preloads default categories, GST slabs, and units for your store.
        </Text>

        <Input
          label="Shop / Business Name *"
          placeholder="e.g. Mahavir Super Market"
          value={businessName}
          onChangeText={setBusinessName}
        />

        <Text style={styles.sectionLabel}>Select Business Type</Text>
        <View style={styles.typeGrid}>
          {BUSINESS_TYPES.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setSelectedType(t.id)}
                style={[styles.typeCard, isSelected && styles.typeCardSelected]}
              >
                <Text style={[styles.typeText, isSelected && styles.typeTextSelected]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          label="GSTIN (Optional)"
          placeholder="e.g. 27AABCS1429B1Z"
          value={gstin}
          onChangeText={setGstin}
          autoCapitalize="characters"
          maxLength={15}
        />

        <Button
          title="Start Free Stock Management"
          onPress={handleSetup}
          loading={loading}
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.lg,
  },
  typeCard: {
    borderWidth: 1.2,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  typeTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  btn: {
    marginTop: spacing.md,
  },
});
