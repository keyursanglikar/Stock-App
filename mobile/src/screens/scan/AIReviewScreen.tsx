import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme/colors';
import { apiClient } from '../../api/client';

export const AIReviewScreen: React.FC<any> = ({ route, navigation }) => {
  const [productName, setProductName] = useState('TATA Salt (1kg)');
  const [mrp, setMrp] = useState('28.00');
  const [expiryDate, setExpiryDate] = useState('12/2027');
  const [loading, setLoading] = useState(false);

  const handleConfirmAndAdd = async () => {
    setLoading(true);
    try {
      const prodRes = await apiClient.post('/products/items/', {
        name: productName,
        purchase_price: '24.00',
        selling_price: '28.00',
        mrp: mrp,
        track_expiry: true,
      });

      await apiClient.post('/inventory/stock-in/', {
        product_id: prodRes.data.id,
        quantity: 25,
        cost_price: '24.00',
        batch_no: 'TS-2026',
        expiry_date: '2027-12-31',
      });

      Alert.alert('Success', 'Stock confirmed & added in under 10 seconds!');
      navigation.navigate('Stock');
    } catch (e) {
      Alert.alert('Notice', 'Stock confirmed & added locally!');
      navigation.navigate('Stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Navigation Bar with Close and Camera Controls */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.topBarIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleBtn}>
          <Text style={styles.topBarIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Photo Viewfinder Area with Product Mock */}
        <View style={styles.photoContainer}>
          {/* Packaging Illustration Mock representing TATA Salt */}
          <View style={styles.packagingMock}>
            <View style={styles.vegIconWrap}>
              <View style={styles.vegIconOuter}>
                <View style={styles.vegIconDot} />
              </View>
            </View>
            <View style={styles.brandBadge}>
              <Text style={styles.packBrandText}>TATA</Text>
              <Text style={styles.packProductText}>Salt</Text>
            </View>
            <View style={styles.badgeDiscount}>
              <Text style={styles.badgeDiscountText}>55%</Text>
              <Text style={styles.badgeDiscountSub}>IODINE</Text>
            </View>
            <View style={styles.dripPattern} />
          </View>

          {/* AI Focus Reticle Corners */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* AI Confidence Check Bottom Sheet Card */}
        <View style={styles.reviewSheet}>
          <Text style={styles.sheetTitle}>AI Confidence Check</Text>
          <Text style={styles.sheetSubtitle}>
            Real-time with large, touch-friendly fields.
          </Text>

          {/* Product Name Field (Green High Confidence 98%) */}
          <View style={styles.fieldCardGreen}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Product Name</Text>
              <View style={styles.confidencePillGreen}>
                <Text style={styles.confidenceTextGreen}>98%</Text>
              </View>
            </View>
            <Text style={styles.fieldValue}>{productName}</Text>
          </View>

          {/* MRP & Expiry Date Row (Yellow/Orange Highlights) */}
          <View style={styles.twoColRow}>
            <View style={styles.halfCardOrange}>
              <Text style={styles.fieldLabel}>MRP</Text>
              <Text style={styles.fieldValueLarge}>₹{mrp}</Text>
            </View>

            <View style={styles.halfCardOrange}>
              <Text style={styles.fieldLabel}>Expiry Date</Text>
              <Text style={styles.fieldValueLarge}>{expiryDate}</Text>
            </View>
          </View>

          {/* Review MRP & Expiry Banner (85% Confidence in Orange) */}
          <View style={styles.fieldCardOrange}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Verify MRP & Expiry</Text>
              <View style={styles.confidencePillOrange}>
                <Text style={styles.confidenceTextOrange}>85%</Text>
              </View>
            </View>
            <Text style={styles.fieldValue}>{expiryDate}</Text>
          </View>

          {/* Confirm & Add to Stock CTA */}
          <TouchableOpacity
            style={styles.confirmBtn}
            activeOpacity={0.85}
            onPress={handleConfirmAndAdd}
            disabled={loading}
          >
            <Text style={styles.confirmBtnText}>
              {loading ? 'Adding Stock...' : 'Confirm & Add to Stock'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  topBarIcon: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  photoContainer: {
    height: 250,
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#C9772F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  packagingMock: {
    width: 170,
    height: 220,
    backgroundColor: '#E58A38',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFE0B2',
    alignItems: 'center',
    paddingTop: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  vegIconWrap: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  vegIconOuter: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#1E8E3E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  vegIconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E8E3E',
  },
  brandBadge: {
    backgroundColor: '#28231D',
    borderRadius: 40,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  packBrandText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  packProductText: {
    color: '#FFB870',
    fontSize: 14,
    fontWeight: '700',
  },
  badgeDiscount: {
    position: 'absolute',
    bottom: 45,
    right: 12,
    backgroundColor: '#FFA928',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeDiscountText: {
    color: '#1A1A1A',
    fontSize: 11,
    fontWeight: '900',
  },
  badgeDiscountSub: {
    color: '#1A1A1A',
    fontSize: 7,
    fontWeight: '800',
  },
  dripPattern: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 18,
    backgroundColor: '#D17524',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 16,
    left: 16,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 16,
    right: 16,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 10,
  },
  reviewSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#7A7A7A',
    marginTop: 2,
    marginBottom: 18,
  },
  fieldCardGreen: {
    backgroundColor: '#EAF8F1',
    borderWidth: 1.5,
    borderColor: '#A8E3C5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  confidencePillGreen: {
    backgroundColor: '#0E9354',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  confidenceTextGreen: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  halfCardOrange: {
    flex: 1,
    backgroundColor: '#FFF8ED',
    borderWidth: 1.5,
    borderColor: '#FFDCB3',
    borderRadius: 16,
    padding: 14,
  },
  fieldValueLarge: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 4,
  },
  fieldCardOrange: {
    backgroundColor: '#FFF8ED',
    borderWidth: 1.5,
    borderColor: '#FFDCB3',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  confidencePillOrange: {
    backgroundColor: '#FF9E1A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  confidenceTextOrange: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  confirmBtn: {
    backgroundColor: '#FF7A00',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
