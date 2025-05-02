import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOrders } from '../context/OrdersContext';
import { Ionicons } from '@expo/vector-icons';
const { SafeAreaView } = require('../components/common');

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, isLoading } = useOrders();

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status color based on order status
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return '#53B175';
      case 'processing':
        return '#F8A44C';
      case 'cancelled':
        return '#F75A53';
      default:
        return '#53B175';
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id.replace('ORD', '')}</Text>
          <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusDot, 
              { backgroundColor: getStatusColor(item.status) }
            ]} 
          />
          <Text style={[
            styles.statusText,
            { color: getStatusColor(item.status) }
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.itemsTitle}>Items</Text>
      <View style={styles.itemsList}>
        {item.items.slice(0, 2).map((product, index) => (
          <View key={`${item.id}-item-${index}`} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {product.name} 
              <Text style={styles.itemQty}> × {product.quantity}</Text>
            </Text>
            <Text style={styles.itemPrice}>${(product.price * product.quantity).toFixed(2)}</Text>
          </View>
        ))}
        {item.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{item.items.length - 2} more items
          </Text>
        )}
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>${item.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#53B175" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="receipt-outline" size={80} color="#53B175" />
          </View>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            You haven't placed any orders yet. When you do, they'll appear here.
          </Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => router.navigate('/shop')}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F2F3F2',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  orderDate: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 8,
  },
  itemsList: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#181725',
  },
  itemQty: {
    color: '#7C7C7C',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181725',
  },
  moreItems: {
    fontSize: 14,
    color: '#53B175',
    marginTop: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F3F2',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#53B175',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  shopNowButton: {
    backgroundColor: '#53B175',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});