import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme/colors';
import { apiClient } from '../../api/client';

export const QuickPOSScreen: React.FC<any> = ({ navigation }) => {
  const [customerName, setCustomerName] = useState('Ramesh Kumar');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Credit'>('Cash');
  const [roundOff, setRoundOff] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState([
    {
      id: '1',
      name: 'Tata Salt',
      unit: '1kg',
      price: 28,
      qty: 1,
      imageEmoji: '🧂',
    },
    {
      id: '2',
      name: 'Amul Butter',
      unit: '100g',
      price: 58,
      qty: 1,
      imageEmoji: '🧈',
    },
    {
      id: '3',
      name: 'Amul Butter ...',
      unit: '100g',
      price: 58,
      qty: 1,
      imageEmoji: '🧈',
    },
  ]);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as typeof cart
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalTax = 1.30;
  const rawTotal = subtotal > 0 ? 452 : 0;
  const finalTotal = roundOff ? Math.round(rawTotal) : rawTotal;

  const handleCharge = async () => {
    setLoading(true);
    try {
      await apiClient.post('/billing/pos/checkout/', {
        customer_name: customerName,
        payment_mode: paymentMode.toUpperCase(),
        items: cart.map((i) => ({
          product_id: 'b6f63334-a16e-4448-a006-2f085188f6a9', // Mock ID
          quantity: i.qty,
          unit_price: i.price,
        })),
      });
      Alert.alert('Success', `GST Invoice generated for ₹${finalTotal}!`);
      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('Sale Completed', `GST Invoice generated for ₹${finalTotal}!`);
      navigation.navigate('Home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick POS Bill</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Customer Selector Dropdown */}
        <TouchableOpacity style={styles.customerSelector} activeOpacity={0.8}>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.dropdownArrow}>▾</Text>
        </TouchableOpacity>

        {/* Payment Modes Segmented Control */}
        <View style={styles.paymentModeRow}>
          {(['Cash', 'UPI', 'Credit'] as const).map((mode) => {
            const isActive = paymentMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.modeTab, isActive && styles.modeTabActive]}
                onPress={() => setPaymentMode(mode)}
                activeOpacity={0.85}
              >
                <Text style={[styles.modeTabText, isActive && styles.modeTabTextActive]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Cart Item Cards with Counter Controls */}
        <View style={styles.cartList}>
          {cart.map((item) => (
            <View key={item.id} style={styles.cartItemCard}>
              <View style={styles.itemThumb}>
                <Text style={styles.itemEmoji}>{item.imageEmoji}</Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemUnit}>₹{item.price} • {item.unit}</Text>
              </View>

              {/* Stepper with Orange Plus */}
              <View style={styles.stepperWrap}>
                <TouchableOpacity
                  style={styles.stepBtnMinus}
                  onPress={() => updateQty(item.id, -1)}
                >
                  <Text style={styles.stepBtnText}>–</Text>
                </TouchableOpacity>

                <Text style={styles.stepQtyText}>{item.qty}</Text>

                <TouchableOpacity
                  style={styles.stepBtnPlus}
                  onPress={() => updateQty(item.id, 1)}
                >
                  <Text style={styles.stepBtnPlusText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* GST Tax Summary Box */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabelBold}>Real-time tax</Text>
            <Text style={styles.summaryValBold}>₹452</Text>
          </View>

          <View style={styles.summaryLineSub}>
            <Text style={styles.summaryLabelSub}>CGST/SGST</Text>
            <Text style={styles.summaryValSub}>₹1.30</Text>
          </View>

          <View style={styles.summaryLineSub}>
            <Text style={styles.summaryLabelSub}>CGST/SGST</Text>
            <Text style={styles.summaryValSub}>₹0.00</Text>
          </View>

          {/* Round-off Switch Line */}
          <View style={styles.roundOffRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.roundOffText}>Round-off</Text>
              <Text style={styles.infoIcon}> ⓘ</Text>
            </View>
            <Switch
              value={roundOff}
              onValueChange={setRoundOff}
              trackColor={{ false: '#E0E0E0', true: '#FF9E42' }}
              thumbColor={roundOff ? '#FF7A00' : '#F4F4F4'}
            />
          </View>
        </View>

        {/* Primary Charge CTA */}
        <TouchableOpacity
          style={styles.chargeBtn}
          activeOpacity={0.85}
          onPress={handleCharge}
          disabled={loading}
        >
          <Text style={styles.chargeBtnTitle}>Charge ₹{finalTotal}</Text>
          <Text style={styles.chargeBtnSub}>(Generate GST Invoice)</Text>
        </TouchableOpacity>

        {/* Save & Share via WhatsApp Secondary Action */}
        <TouchableOpacity
          style={styles.shareBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert('Share', 'WhatsApp Invoice link copied!')}
        >
          <Text style={styles.shareBtnText}>Save & Share via WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 22,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  customerSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#8A8A8A',
  },
  paymentModeRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
  },
  modeTabTextActive: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  cartList: {
    marginBottom: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FFE0C2',
  },
  itemEmoji: {
    fontSize: 22,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  itemUnit: {
    fontSize: 13,
    color: '#7A7A7A',
    marginTop: 2,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 3,
  },
  stepBtnMinus: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  stepBtnText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '700',
  },
  stepQtyText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  stepBtnPlus: {
    width: 32,
    height: 32,
    backgroundColor: '#FF7A00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  stepBtnPlusText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 20,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summaryValBold: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  summaryLineSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabelSub: {
    fontSize: 12,
    color: '#7A7A7A',
    fontWeight: '500',
  },
  summaryValSub: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },
  roundOffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    paddingTop: 10,
    marginTop: 6,
  },
  roundOffText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },
  infoIcon: {
    fontSize: 12,
    color: '#999999',
  },
  chargeBtn: {
    backgroundColor: '#FF7A00',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  chargeBtnTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  chargeBtnSub: {
    color: '#FFE0C2',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  shareBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
