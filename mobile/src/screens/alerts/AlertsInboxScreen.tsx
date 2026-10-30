import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const AlertsInboxScreen: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'EXPIRY' | 'LOW_STOCK'>('ALL');

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'EXPIRY_URGENT',
      title: 'Batch Expiring in 7 Days',
      product: 'Amul Butter (100g) — Batch #AB-880',
      detail: 'Expiry Date: 2026-11-06 (45 units remaining in rack)',
      severity: 'danger',
    },
    {
      id: '2',
      type: 'LOW_STOCK',
      title: 'Low Stock Level Reached',
      product: 'Tata Salt (1kg)',
      detail: 'Current stock: 2 kg (Threshold alert level is 5 kg)',
      severity: 'warning',
    },
    {
      id: '3',
      type: 'EXPIRY_WARNING',
      title: 'Expiring within 30 Days',
      product: 'Dolo 650 Tablets — Batch #DL-402',
      detail: 'Expiry Date: 2026-11-28 (12 strips in stock)',
      severity: 'warning',
    },
    {
      id: '4',
      type: 'LOW_STOCK',
      title: 'Out of Stock Alert',
      product: 'Fortune Sunflower Oil (1L)',
      detail: '0 units in stock — Customer sales blocked',
      severity: 'danger',
    },
  ]);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const filtered = alerts.filter((a) => {
    if (filter === 'EXPIRY') return a.type.startsWith('EXPIRY');
    if (filter === 'LOW_STOCK') return a.type === 'LOW_STOCK';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Alerts & Notifications</Text>
          <Text style={styles.headerSubtitle}>
            Expiry alerts, low-stock notifications & reorder triggers
          </Text>
        </View>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => setAlerts([])}
        >
          <Text style={styles.clearBtnText}>Dismiss All</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'ALL' && styles.filterTabActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.filterTabText, filter === 'ALL' && styles.filterTabTextActive]}>
            All Alerts ({alerts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'EXPIRY' && styles.filterTabActive]}
          onPress={() => setFilter('EXPIRY')}
        >
          <Text style={[styles.filterTabText, filter === 'EXPIRY' && styles.filterTabTextActive]}>
            ⌛ Expiry Tracking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'LOW_STOCK' && styles.filterTabActive]}
          onPress={() => setFilter('LOW_STOCK')}
        >
          <Text style={[styles.filterTabText, filter === 'LOW_STOCK' && styles.filterTabTextActive]}>
            ⚠️ Low Stock
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alerts List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>All Inventory Clear!</Text>
            <Text style={styles.emptySubtitle}>No critical stock or expiry issues detected.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isDanger = item.severity === 'danger';
          return (
            <View
              style={[
                styles.alertCard,
                isDanger ? styles.alertCardDanger : styles.alertCardWarning,
              ]}
            >
              <View style={styles.alertHeader}>
                <View style={styles.titleWithIcon}>
                  <Text style={styles.alertEmoji}>{isDanger ? '🚨' : '⚠️'}</Text>
                  <Text
                    style={[
                      styles.alertTitle,
                      isDanger ? styles.titleDanger : styles.titleWarning,
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.dismissBtn}
                  onPress={() => dismissAlert(item.id)}
                >
                  <Text style={styles.dismissBtnText}>Dismiss</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.productText}>{item.product}</Text>
              <Text style={styles.detailText}>{item.detail}</Text>

              {item.type === 'LOW_STOCK' && (
                <TouchableOpacity
                  style={styles.whatsappActionBtn}
                  onPress={() => Alert.alert('WhatsApp', 'Pre-filled Reorder PO created!')}
                >
                  <Text style={styles.whatsappActionText}>💬 1-Tap Reorder via WhatsApp</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 2,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
  },
  filterTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#ECECEC',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterTabTextActive: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  alertCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.2,
  },
  alertCardDanger: {
    backgroundColor: '#FFF4F4',
    borderColor: '#FFD3D3',
  },
  alertCardWarning: {
    backgroundColor: '#FFF9F0',
    borderColor: '#FFE2B8',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  titleDanger: {
    color: '#D32F2F',
  },
  titleWarning: {
    color: '#BD5700',
  },
  dismissBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dismissBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  productText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  whatsappActionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  whatsappActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8A8A8A',
    marginTop: 4,
  },
});
