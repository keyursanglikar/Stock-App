import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../state/authStore';
import { useLanguageStore } from '../../state/languageStore';

export const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const { business } = useAuthStore();
  const { t } = useLanguageStore();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/reports/dashboard/');
      setMetrics(res.data);
    } catch (e) {
      setMetrics({
        today_revenue: '14,230.00',
        today_profit: '3,840.00',
        low_stock_count: 14,
        alerts_count: 3,
        stock_valuation_cost: '2,48,500.00',
        stock_valuation_mrp: '3,12,000.00',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchDashboard}
            colors={['#FF7A00']}
          />
        }
      >
        {/* ========================================================
            HEADER: Brand, Business Switcher & Profile Link
           ======================================================== */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.shopSelector}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Settings')}
          >
            <View>
              <Text style={styles.brandTitle}>
                Stock<Text style={{ color: '#FF7A00' }}>Wise</Text>
              </Text>
              <View style={styles.shopSubRow}>
                <Text style={styles.shopName} numberOfLines={1}>
                  {business?.name || 'Apna Kirana Store'}
                </Text>
                <Text style={styles.dropdownArrow}> ▾</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBadgeBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.profileBadgeEmoji}>👤</Text>
            <Text style={styles.profileBadgeText}>{t.profile}</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================
            SECTION 1: TODAY'S BUSINESS OVERVIEW
           ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t.overviewToday}</Text>
            <Text style={styles.dateBadge}>
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </Text>
          </View>

          <View style={styles.salesRow}>
            <View>
              <Text style={styles.subtext}>{t.totalSales}</Text>
              <Text style={styles.salesValue}>
                ₹{metrics?.today_revenue || '14,230'}
              </Text>
            </View>

            <View style={styles.sparklineContainer}>
              <View style={styles.sparklineCurve}>
                <View style={styles.sparklineDot} />
              </View>
            </View>
          </View>

          <View style={styles.metricsSplitRow}>
            <View style={styles.splitBox}>
              <Text style={styles.subtext}>{t.grossProfit}</Text>
              <Text style={styles.profitVal}>
                +₹{metrics?.today_profit || '3,840'}
              </Text>
            </View>
            <View style={styles.splitDivider} />
            <View style={styles.splitBox}>
              <Text style={styles.subtext}>{t.stockValue}</Text>
              <Text style={styles.valVal}>
                ₹{metrics?.stock_valuation_cost || '2,48,500'}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================
            SECTION 2: STOCK HEALTH & ALERTS
           ======================================================== */}
        <Text style={styles.sectionHeading}>{t.stockHealth}</Text>
        <View style={styles.alertsGrid}>
          <TouchableOpacity
            style={styles.alertCardWarning}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Stock')}
          >
            <View style={styles.alertIconBadgeYellow}>
              <Text style={styles.alertEmoji}>⚠️</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.alertCardTitle}>{t.lowStock}</Text>
              <Text style={styles.alertCardSubtitle}>
                {metrics?.low_stock_count || 14} items
              </Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alertCardDanger}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Alerts')}
          >
            <View style={styles.alertIconBadgeRed}>
              <Text style={styles.alertEmoji}>⌛</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.alertCardTitle}>{t.expiringSoon}</Text>
              <Text style={styles.alertCardSubtitle}>
                {metrics?.alerts_count || 3} items
              </Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================
            SECTION 3: QUICK ACTIONS (4-GRID)
           ======================================================== */}
        <Text style={styles.sectionHeading}>{t.coreOps}</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridTile}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Scan')}
          >
            <View style={styles.gridIconWrap}>
              <Text style={styles.gridEmoji}>📸</Text>
            </View>
            <Text style={styles.gridLabel}>{t.scanAdd}</Text>
            <Text style={styles.gridHint}>Auto AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridTile}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Bills')}
          >
            <View style={styles.gridIconWrap}>
              <Text style={styles.gridEmoji}>⚡</Text>
            </View>
            <Text style={styles.gridLabel}>{t.quickPOS}</Text>
            <Text style={styles.gridHint}>GST POS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridTile}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Stock')}
          >
            <View style={styles.gridIconWrap}>
              <Text style={styles.gridEmoji}>👥</Text>
            </View>
            <Text style={styles.gridLabel}>{t.suppliers}</Text>
            <Text style={styles.gridHint}>PO Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridTile}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Stock')}
          >
            <View style={styles.gridIconWrap}>
              <Text style={styles.gridEmoji}>📊</Text>
            </View>
            <Text style={styles.gridLabel}>{t.reports}</Text>
            <Text style={styles.gridHint}>P&L / Tax</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================
            SECTION 4: RECENT MOVEMENTS
           ======================================================== */}
        <Text style={styles.sectionHeading}>{t.recentMovements}</Text>
        <View style={styles.activityCardGreen}>
          <Text style={styles.activityEmoji}>🔥</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.pillGreenTitle}>Amul Butter (100g)</Text>
            <Text style={styles.pillGreenSubtitle}>18 units sold today</Text>
          </View>
        </View>

        <View style={styles.activityCardOrange}>
          <View style={styles.alertHeaderRow}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>Tata Salt (1kg)</Text>
              <Text style={styles.alertSub}>2 units remaining</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.whatsappBtn} activeOpacity={0.85}>
            <Text style={styles.whatsappBtnIcon}>💬</Text>
            <Text style={styles.whatsappBtnText}>{t.reorderPO}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
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
  shopSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  shopSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  shopName: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
    maxWidth: 160,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#999999',
  },
  profileBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#FFE0C2',
  },
  profileBadgeEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  profileBadgeText: {
    color: '#FF7A00',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#737373',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateBadge: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  salesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  subtext: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '500',
  },
  salesValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  sparklineContainer: {
    width: 70,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  sparklineCurve: {
    width: 58,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FF7A00',
    borderBottomRightRadius: 14,
    transform: [{ rotate: '-12deg' }],
  },
  sparklineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF7A00',
    marginRight: -4,
    marginTop: -4,
  },
  metricsSplitRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 12,
  },
  splitBox: {
    flex: 1,
  },
  splitDivider: {
    width: 1,
    backgroundColor: '#EBEBEB',
    marginHorizontal: 12,
  },
  profitVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0E8A4B',
    marginTop: 2,
  },
  valVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 2,
  },
  alertsGrid: {
    gap: 8,
    marginBottom: 18,
  },
  alertCardWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#FFE5C2',
  },
  alertCardDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2F2',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#FFD1D1',
  },
  alertIconBadgeYellow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFE9C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIconBadgeRed: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFD8D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertEmoji: {
    fontSize: 16,
  },
  alertCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  alertCardSubtitle: {
    fontSize: 11,
    color: '#737373',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#B0B0B0',
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 18,
  },
  gridTile: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: '#ECECEC',
  },
  gridIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridEmoji: {
    fontSize: 20,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  gridHint: {
    fontSize: 10,
    color: '#9E9E9E',
    marginTop: 2,
  },
  activityCardGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF9F1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#C7F0DB',
  },
  activityEmoji: {
    fontSize: 18,
  },
  pillGreenTitle: {
    color: '#0E8A4B',
    fontSize: 12,
    fontWeight: '800',
  },
  pillGreenSubtitle: {
    color: '#4B6B59',
    fontSize: 11,
  },
  activityCardOrange: {
    backgroundColor: '#FFF7EE',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFE8D1',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#BD5700',
  },
  alertSub: {
    fontSize: 11,
    color: '#737373',
  },
  whatsappBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappBtnIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  whatsappBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
