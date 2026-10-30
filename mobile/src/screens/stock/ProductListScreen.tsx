import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../api/client';

export const ProductListScreen: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'CATEGORIES' | 'BATCHES'>('ITEMS');
  const [filter, setFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample items for instant, rich presentation
  const defaultItems = [
    {
      id: '1',
      name: 'Tata Salt Vacuum Evaporated (1kg)',
      category: 'Grains & Pulses',
      barcode: '8901030383124',
      selling_price: '28.00',
      purchase_price: '24.00',
      current_stock: '2.000',
      unit_code: 'KG',
      is_low_stock: true,
      batch_no: 'TS-2026',
      expiry_date: '2027-12-31',
    },
    {
      id: '2',
      name: 'Amul Butter Pasteurised (100g)',
      category: 'Dairy Products',
      barcode: '8901262010053',
      selling_price: '58.00',
      purchase_price: '50.00',
      current_stock: '45.000',
      unit_code: 'PCS',
      is_low_stock: false,
      batch_no: 'AB-880',
      expiry_date: '2026-11-20',
    },
    {
      id: '3',
      name: 'Fortune Sunlite Sunflower Oil (1L)',
      category: 'Cooking Oils',
      barcode: '8906007281023',
      selling_price: '145.00',
      purchase_price: '130.00',
      current_stock: '0.000',
      unit_code: 'LTR',
      is_low_stock: true,
      batch_no: 'FO-991',
      expiry_date: '2027-04-15',
    },
    {
      id: '4',
      name: 'Parle-G Glucose Biscuits (800g)',
      category: 'Snacks & Biscuits',
      barcode: '8901719101019',
      selling_price: '80.00',
      purchase_price: '70.00',
      current_stock: '24.000',
      unit_code: 'PKT',
      is_low_stock: false,
      batch_no: 'PG-2026',
      expiry_date: '2027-08-10',
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/products/items/');
      const serverItems = res.data.results || res.data;
      setProducts(serverItems.length > 0 ? serverItems : defaultItems);
    } catch (e) {
      setProducts(defaultItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = (products.length > 0 ? products : defaultItems).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));

    if (!matchesSearch) return false;
    if (filter === 'LOW') return p.is_low_stock || parseFloat(p.current_stock) <= 5;
    if (filter === 'OUT') return parseFloat(p.current_stock) <= 0;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Stock & Inventory Master</Text>
          <Text style={styles.headerSubtitle}>Real-time stock balance & batch tracking</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.addBtnText}>+ Add Stock</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Sub-Navigation Tabs */}
      <View style={styles.subTabBar}>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'ITEMS' && styles.subTabActive]}
          onPress={() => setActiveTab('ITEMS')}
        >
          <Text style={[styles.subTabText, activeTab === 'ITEMS' && styles.subTabTextActive]}>
            All Products ({filtered.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTab, activeTab === 'CATEGORIES' && styles.subTabActive]}
          onPress={() => setActiveTab('CATEGORIES')}
        >
          <Text style={[styles.subTabText, activeTab === 'CATEGORIES' && styles.subTabTextActive]}>
            Categories
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTab, activeTab === 'BATCHES' && styles.subTabActive]}
          onPress={() => setActiveTab('BATCHES')}
        >
          <Text style={[styles.subTabText, activeTab === 'BATCHES' && styles.subTabTextActive]}>
            Batches & Expiry
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <TextInput
          placeholder="Search by product name, brand or scan barcode..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Chips Row */}
      <View style={styles.filterChipsRow}>
        <TouchableOpacity
          style={[styles.chip, filter === 'ALL' && styles.chipActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.chipText, filter === 'ALL' && styles.chipTextActive]}>
            All Inventory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, filter === 'LOW' && styles.chipActive]}
          onPress={() => setFilter('LOW')}
        >
          <Text style={[styles.chipText, filter === 'LOW' && styles.chipTextActive]}>
            ⚠️ Low Stock Alert
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, filter === 'OUT' && styles.chipActive]}
          onPress={() => setFilter('OUT')}
        >
          <Text style={[styles.chipText, filter === 'OUT' && styles.chipTextActive]}>
            ❌ Out of Stock
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inventory Item List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchProducts}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isOut = parseFloat(item.current_stock) <= 0;
          const isLow = item.is_low_stock || parseFloat(item.current_stock) <= 5;

          return (
            <View style={styles.itemCard}>
              <View style={styles.itemHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category || 'General'}</Text>
                </View>

                {/* Stock Level Badge */}
                <View
                  style={[
                    styles.stockBadge,
                    isOut ? styles.badgeOut : isLow ? styles.badgeLow : styles.badgeOk,
                  ]}
                >
                  <Text
                    style={[
                      styles.stockBadgeText,
                      isOut ? styles.textOut : isLow ? styles.textLow : styles.textOk,
                    ]}
                  >
                    {isOut ? 'Out of Stock' : `${item.current_stock} ${item.unit_code || 'PCS'}`}
                  </Text>
                </View>
              </View>

              {/* Pricing & Barcode Row */}
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.metaLabel}>Selling Price</Text>
                  <Text style={styles.sellingPrice}>₹{item.selling_price}</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>Cost (Avg)</Text>
                  <Text style={styles.costPrice}>₹{item.purchase_price}</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>Barcode</Text>
                  <Text style={styles.barcodeText}>{item.barcode || 'Manual'}</Text>
                </View>
              </View>

              {/* Batch & Expiry Tag (if tracked) */}
              {item.batch_no && (
                <View style={styles.batchInfoRow}>
                  <Text style={styles.batchTag}>Batch: {item.batch_no}</Text>
                  <Text style={styles.expiryTag}>Exp: {item.expiry_date}</Text>
                </View>
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
  addBtn: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: '#ECECEC',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 3,
    marginBottom: 10,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  subTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  subTabTextActive: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchInput: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E6E6E6',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#1A1A1A',
  },
  filterChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  chipActive: {
    backgroundColor: '#FF7A00',
    borderColor: '#FF7A00',
  },
  chipText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#ECECEC',
    marginBottom: 10,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  itemCategory: {
    fontSize: 11,
    color: '#8A8A8A',
    fontWeight: '500',
    marginTop: 2,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeOk: {
    backgroundColor: '#EBF9F1',
  },
  badgeLow: {
    backgroundColor: '#FFF4E8',
  },
  badgeOut: {
    backgroundColor: '#FDECEC',
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  textOk: {
    color: '#0E8A4B',
  },
  textLow: {
    color: '#FF7A00',
  },
  textOut: {
    color: '#D32F2F',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 10,
  },
  metaLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  sellingPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 1,
  },
  costPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginTop: 1,
  },
  barcodeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 1,
  },
  batchInfoRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8F8F8',
  },
  batchTag: {
    fontSize: 11,
    color: '#777',
    fontWeight: '600',
  },
  expiryTag: {
    fontSize: 11,
    color: '#BD5700',
    fontWeight: '700',
  },
});
