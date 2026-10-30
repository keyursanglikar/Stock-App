import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../state/authStore';
import { useLanguageStore, LanguageCode } from '../../state/languageStore';

export const SettingsScreen: React.FC = () => {
  const { business, user, logout } = useAuthStore();
  const { lang, setLanguage, t } = useLanguageStore();

  const [shopName, setShopName] = useState(business?.name || 'Apna Kirana Store');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [gstin, setGstin] = useState(business?.gstin || '27AABCS1429B1Z');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Saved', 'Store profile updated successfully!');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t.shopProfile}</Text>
          <TouchableOpacity
            style={styles.editToggleBtn}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Text style={styles.editToggleText}>
              {isEditing ? t.save : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card Banner */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>🏪</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.profileShopName} numberOfLines={1}>
              {shopName}
            </Text>
            <Text style={styles.profileSub}>+91 {phone}</Text>
            <View style={styles.freePlanPill}>
              <Text style={styles.freePlanPillText}>{t.freeForever}</Text>
            </View>
          </View>
        </View>

        {/* ========================================================
            SECTION 1: LANGUAGE SWITCHER (EN, HI, MR)
           ======================================================== */}
        <Text style={styles.sectionHeading}>{t.language}</Text>
        <View style={styles.langSelectorRow}>
          {(
            [
              { code: 'en', label: 'English', sub: 'Default' },
              { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
              { code: 'mr', label: 'मराठी', sub: 'Marathi' },
            ] as const
          ).map((item) => {
            const isSelected = lang === item.code;
            return (
              <TouchableOpacity
                key={item.code}
                style={[styles.langChip, isSelected && styles.langChipSelected]}
                onPress={() => setLanguage(item.code as LanguageCode)}
                activeOpacity={0.8}
              >
                <Text style={[styles.langChipText, isSelected && styles.langChipTextSelected]}>
                  {item.label}
                </Text>
                <Text style={[styles.langChipSub, isSelected && styles.langChipSubSelected]}>
                  {item.sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ========================================================
            SECTION 2: BUSINESS DETAILS
           ======================================================== */}
        <Text style={styles.sectionHeading}>{t.shopProfile}</Text>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.shopName}</Text>
            <TextInput
              style={[styles.inputField, !isEditing && styles.inputDisabled]}
              value={shopName}
              editable={isEditing}
              onChangeText={setShopName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.ownerPhone}</Text>
            <TextInput
              style={[styles.inputField, styles.inputDisabled]}
              value={phone}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.gstin}</Text>
            <TextInput
              style={[styles.inputField, !isEditing && styles.inputDisabled]}
              value={gstin}
              editable={isEditing}
              onChangeText={setGstin}
              placeholder="e.g. 27AABCS1429B1Z"
            />
          </View>
        </View>

        {/* ========================================================
            SECTION 3: SETTINGS & EXPORTS
           ======================================================== */}
        <Text style={styles.sectionHeading}>Settings</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => Alert.alert('GST Format', 'Invoice Series: INV/2026/0001')}
          >
            <Text style={styles.menuItemIcon}>🧾</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemTitle}>{t.invoiceSettings}</Text>
              <Text style={styles.menuItemSubtitle}>Print format, logo & GST slabs</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Export', 'Excel report ready for download!')}
          >
            <Text style={styles.menuItemIcon}>📥</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemTitle}>{t.exportData}</Text>
              <Text style={styles.menuItemSubtitle}>All stock & sales ledger data</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================
            SECTION 4: LOGOUT
           ======================================================== */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert(t.logout, 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: t.logout, style: 'destructive', onPress: logout },
            ]);
          }}
        >
          <Text style={styles.logoutBtnText}>🚪 {t.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  editToggleBtn: {
    backgroundColor: '#FFF4E8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE0C2',
  },
  editToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7A00',
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#ECECEC',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFF5EC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFE0C2',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  profileShopName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  profileSub: {
    fontSize: 13,
    color: '#7A7A7A',
    marginTop: 2,
  },
  freePlanPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBF9F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  freePlanPillText: {
    color: '#0E8A4B',
    fontSize: 10,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 4,
  },
  langSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  langChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E6E6E6',
  },
  langChipSelected: {
    backgroundColor: '#FFF8F0',
    borderColor: '#FF7A00',
  },
  langChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  langChipTextSelected: {
    color: '#FF7A00',
    fontWeight: '800',
  },
  langChipSub: {
    fontSize: 10,
    color: '#9E9E9E',
    marginTop: 2,
  },
  langChipSubSelected: {
    color: '#FF7A00',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#ECECEC',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    color: '#7A7A7A',
    fontWeight: '600',
    marginBottom: 4,
  },
  inputField: {
    height: 44,
    borderWidth: 1.2,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    backgroundColor: '#FAFAFA',
  },
  inputDisabled: {
    backgroundColor: '#F8F8F8',
    color: '#555',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#ECECEC',
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: '#BDBDBD',
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#FDECEC',
    borderWidth: 1.2,
    borderColor: '#F8C8C8',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D32F2F',
  },
});
