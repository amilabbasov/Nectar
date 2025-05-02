import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from '../../components/common';
import { useModalAnimation } from '../hooks/useModalAnimation';
import { useKeyboardHandling } from '../hooks/useKeyboardHandling';

import CartItem from '../components/cart/CartItem';
import AuthModal from '../components/cart/AuthModal';
import CheckoutModal from '../components/cart/CheckoutModal';

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const router = useRouter();
  
  // State management
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Custom hooks
  const checkoutAnimations = useModalAnimation(checkoutModalVisible);
  const authAnimations = useModalAnimation(authModalVisible);
  const { modalPosition } = useKeyboardHandling(currentStep);

  // Calculations
  const totalAmount = getCartTotal();
  const deliveryFee = 2.99;
  const tax = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + deliveryFee + tax;

  // Reset modal state when closed
  useEffect(() => {
    if (!checkoutModalVisible) {
      setCurrentStep(1);
      setProcessing(false);
      setOrderComplete(false);
    }
  }, [checkoutModalVisible]);

  const handleCheckout = () => {
    if (!user) {
      setAuthModalVisible(true);
    } else {
      setCheckoutModalVisible(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setCheckoutModalVisible(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setProcessing(true);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order object
      const newOrder = {
        items: [...cart],
        subtotal: totalAmount,
        deliveryFee,
        tax,
        total: finalTotal,
        address,
        paymentMethod,
        status: 'completed',
      };
      
      // Add order through the OrdersContext
      await addOrder(newOrder);
      
      // Clear cart
      clearCart();
      setOrderComplete(true);
      
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>My Cart</Text>
      <ScrollView style={styles.scrollView}>
        {cart.length === 0 ? (
          <Text style={styles.emptyCart}>Your cart is empty</Text>
        ) : (
          cart.map((item, index) => (
            <CartItem 
              key={`cart-item-${item.id || index}`}
              item={item} 
              index={index}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))
        )}
      </ScrollView>
      
      {cart.length > 0 && (
        <View style={styles.checkoutContainer}>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>
              Go to Checkout
            </Text>
            <Text style={styles.totalAmount}>
              ${getCartTotal().toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Checkout Modal */}
      <CheckoutModal 
        visible={checkoutModalVisible}
        onClose={() => setCheckoutModalVisible(false)}
        currentStep={currentStep}
        address={address}
        setAddress={setAddress}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        processing={processing}
        orderComplete={orderComplete}
        handleNextStep={handleNextStep}
        handlePreviousStep={handlePreviousStep}
        handlePlaceOrder={handlePlaceOrder}
        totalAmount={totalAmount}
        deliveryFee={deliveryFee}
        tax={tax}
        finalTotal={finalTotal}
        animatedValues={checkoutAnimations}
        modalPosition={modalPosition}
      />

      {/* Authentication Modal */}
      <AuthModal 
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSignIn={() => {
          setAuthModalVisible(false);
          router.push('/(auth)/login/login');
        }}
        onSignUp={() => {
          setAuthModalVisible(false);
          router.push('/(auth)/register/register');
        }}
        animatedValues={authAnimations}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181725',
    textAlign: 'center',
    marginVertical: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyCart: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7C7C7C',
    marginTop: 32,
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  checkoutButton: {
    backgroundColor: '#53B175',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});