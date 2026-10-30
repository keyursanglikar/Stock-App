import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme/colors';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../state/authStore';

export const PhoneLoginScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/auth/otp/send/', { phone });
      setStep('OTP');
    } catch (e: any) {
      Alert.alert('Notice', 'Using test mode OTP 123456');
      setStep('OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      Alert.alert('Incomplete OTP', 'Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/otp/verify/', { phone, otp: fullOtp });
      setAuth(res.data.access_token, res.data.user, res.data.business);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Invalid OTP. Use 123456');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Brand Logo & Icon */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.boxIcon}>📦</Text>
            </View>
            <Text style={styles.brandTitle}>
              Stock<Text style={styles.brandAccent}>Wise</Text>
            </Text>
            <Text style={styles.brandTagline}>Instant Stock & GST Billing</Text>
          </View>

          {step === 'PHONE' ? (
            <View style={styles.card}>
              <Text style={styles.inputTitle}>Enter Mobile Number</Text>
              
              {/* Phone Input with Indian Flag */}
              <View style={styles.phoneInputRow}>
                <View style={styles.flagBadge}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={styles.countryCode}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Phone Number"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, phone.length === 10 ? styles.btnActive : styles.btnDisabled]}
                onPress={handleSendOTP}
                disabled={loading || phone.length < 10}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>
                  {loading ? 'Sending OTP...' : 'Get OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.otpHeaderTitle}>OTP verification field</Text>
              
              {/* 6 Digit Boxed Inputs */}
              <View style={styles.otpBoxesRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(t) => handleOtpChange(t, idx)}
                    onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, styles.btnActive]}
                onPress={handleVerifyOTP}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>
                  {loading ? 'Verifying...' : 'Verify & Enter'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setStep('PHONE')}
                style={styles.resendBtn}
              >
                <Text style={styles.resendText}>
                  Resend OTP via <Text style={styles.resendAccent}>SMS/WhatsApp</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Kirana Store Graphic Footer */}
          <View style={styles.illustrationSection}>
            <View style={styles.storeRoof}>
              <View style={styles.awningStripe} />
              <View style={[styles.awningStripe, { backgroundColor: '#FF8A1E' }]} />
              <View style={styles.awningStripe} />
              <View style={[styles.awningStripe, { backgroundColor: '#FF8A1E' }]} />
              <View style={styles.awningStripe} />
            </View>
            <View style={styles.storeBody}>
              <View style={styles.storeSign}>
                <Text style={styles.storeSignText}>StockWise</Text>
              </View>
              <View style={styles.storeWindowRow}>
                <View style={styles.storeWindow} />
                <View style={styles.storeDoor} />
                <View style={styles.storeWindow} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#FFF4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FFE0C2',
  },
  boxIcon: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#FF7A00',
  },
  brandTagline: {
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    width: '100%',
    maxWidth: 380,
  },
  inputTitle: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '600',
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    height: 54,
    borderWidth: 1.5,
    borderColor: '#E6E6E6',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#EBEBEB',
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    paddingLeft: 12,
    fontWeight: '500',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnActive: {
    backgroundColor: '#FF7A00',
  },
  btnDisabled: {
    backgroundColor: '#FFAE66',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  otpHeaderTitle: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E6E6E6',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  otpBoxFilled: {
    borderColor: '#FF7A00',
    backgroundColor: '#FFF9F4',
  },
  resendBtn: {
    marginTop: 18,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: '#7A7A7A',
    fontWeight: '500',
  },
  resendAccent: {
    color: '#FF7A00',
    fontWeight: '700',
  },
  illustrationSection: {
    width: 220,
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.9,
  },
  storeRoof: {
    flexDirection: 'row',
    width: '100%',
    height: 24,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  awningStripe: {
    flex: 1,
    backgroundColor: '#FF9E42',
  },
  storeBody: {
    width: '92%',
    borderWidth: 2,
    borderColor: '#FFE0C2',
    borderTopWidth: 0,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
  },
  storeSign: {
    backgroundColor: '#FFE8D1',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  storeSignText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF7A00',
  },
  storeWindowRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
    height: 40,
  },
  storeWindow: {
    width: 36,
    height: 32,
    backgroundColor: '#FFE9D4',
    borderRadius: 4,
  },
  storeDoor: {
    width: 30,
    height: 40,
    backgroundColor: '#FFD3A8',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});
