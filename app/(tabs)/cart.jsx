import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TextInput, ActivityIndicator, Animated, Dimensions, StatusBar, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { Ionicons } from '@expo/vector-icons';
const { SafeAreaView } = require('../../components/common');

const { height } = Dimensions.get('window');

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const totalAmount = getCartTotal();
  const deliveryFee = 2.99;
  const tax = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + deliveryFee + tax;

  // Handle modal animations
  useEffect(() => {
    if (checkoutModalVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          mass: 1.2,
          stiffness: 100,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [checkoutModalVisible]);

  // Reset modal state when closed
  useEffect(() => {
    if (!checkoutModalVisible) {
      setCurrentStep(1);
      setProcessing(false);
      setOrderComplete(false);
    }
  }, [checkoutModalVisible]);

  // Handle keyboard events
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        setKeyboardHeight(keyboardHeight);
        if (Platform.OS === 'ios') {
          if (currentStep === 1) { // Only adjust for address entry step
            setModalPosition(keyboardHeight); // Increase offset to ensure buttons are visible
          }
        }
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setModalPosition(0);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [currentStep]);

  const handleCheckout = () => {
    setCheckoutModalVisible(true);
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

  const renderCartItem = (item, index) => (
    <View key={`cart-item-${item.id || index}`} style={styles.cartItem}>
      <Image source={item.img} style={styles.productImage} resizeMode="contain" />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productWeight}>
          {item.pieces}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <TouchableOpacity
          onPress={() => removeFromCart(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderCheckoutContent = () => {
    if (processing) {
      return (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#53B175" />
          <Text style={styles.processingText}>Processing your order...</Text>
        </View>
      );
    }

    if (orderComplete) {
      return (
        <View style={styles.completeContainer}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#53B175" />
          </View>
          <Text style={styles.completeTitle}>Order Placed!</Text>
          <Text style={styles.completeText}>
            Your order has been placed successfully. You can check the status in My Orders section.
          </Text>
          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={() => setCheckoutModalVisible(false)}
          >
            <Text style={styles.completeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (currentStep) {
      case 1: // Delivery Address
        return (
          <>
            <Text style={styles.stepTitle}>Delivery Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your delivery address"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
                <Text style={styles.backButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.nextButton, !address && styles.disabledButton]} 
                onPress={handleNextStep}
                disabled={!address}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 2: // Payment Method
        return (
          <>
            <Text style={styles.stepTitle}>Payment Method</Text>
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'card' && styles.selectedPayment]} 
              onPress={() => setPaymentMethod('card')}
            >
              <Ionicons name="card-outline" size={24} color="#53B175" style={styles.paymentIcon} />
              <Text style={styles.paymentText}>Credit/Debit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.paymentOption, paymentMethod === 'cash' && styles.selectedPayment]} 
              onPress={() => setPaymentMethod('cash')}
            >
              <Ionicons name="cash-outline" size={24} color="#53B175" style={styles.paymentIcon} />
              <Text style={styles.paymentText}>Cash on Delivery</Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 3: // Order Summary
        return (
          <>
            <Text style={styles.stepTitle}>Order Summary</Text>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
              </View>

              <View style={styles.deliveryInfoContainer}>
                <Text style={styles.deliveryInfoTitle}>Delivery Information</Text>
                <Text style={styles.deliveryInfoText}>{address}</Text>
                <Text style={styles.deliveryInfoTitle}>Payment Method</Text>
                <Text style={styles.deliveryInfoText}>
                  {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                </Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                <Text style={styles.placeOrderText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>My Cart</Text>
      <ScrollView style={styles.scrollView}>
        {cart.length === 0 ? (
          <Text style={styles.emptyCart}>Your cart is empty</Text>
        ) : (
          cart.map((item, index) => renderCartItem(item, index))
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
      <Modal
        visible={checkoutModalVisible}
        transparent={true}
        statusBarTranslucent={true}
        animationType="none"
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <TouchableOpacity 
              style={styles.dismissArea} 
              onPress={() => setCheckoutModalVisible(false)}
              activeOpacity={1}
            />
            
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: slideAnim }],
                  bottom: modalPosition, // Position modal above keyboard
                }
              ]}
            >
              <View style={styles.modalContainer}>
                {/* Stepper */}
                {!processing && !orderComplete && (
                  <View style={styles.stepper}>
                    <View style={[styles.stepCircle, currentStep >= 1 && styles.activeStep]}>
                      <Text style={styles.stepNumber}>1</Text>
                    </View>
                    <View style={styles.stepLine} />
                    <View style={[styles.stepCircle, currentStep >= 2 && styles.activeStep]}>
                      <Text style={styles.stepNumber}>2</Text>
                    </View>
                    <View style={styles.stepLine} />
                    <View style={[styles.stepCircle, currentStep >= 3 && styles.activeStep]}>
                      <Text style={styles.stepNumber}>3</Text>
                    </View>
                  </View>
                )}
                
                {/* Content based on current step */}
                <ScrollView 
                  style={{ flex: 1 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {renderCheckoutContent()}
                </ScrollView>
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
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
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  productImage: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181725',
  },
  productWeight: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F3F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#53B175',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 24,
    color: '#7C7C7C',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
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
  
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F3F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#53B175',
  },
  stepNumber: {
    color: '#181725',
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#F2F3F2',
    marginHorizontal: 5,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    minWidth: 100,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#181725',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#53B175',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedPayment: {
    borderColor: '#53B175',
    backgroundColor: 'rgba(83, 177, 117, 0.1)',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  paymentText: {
    fontSize: 16,
    color: '#181725',
  },
  summaryContainer: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  summaryValue: {
    fontSize: 14,
    color: '#181725',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181725',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#53B175',
  },
  deliveryInfoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  deliveryInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 4,
  },
  deliveryInfoText: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 10,
  },
  placeOrderButton: {
    backgroundColor: '#53B175',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#181725',
    textAlign: 'center',
  },
  completeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#53B175',
    marginBottom: 12,
  },
  completeText: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 24,
  },
  completeButton: {
    backgroundColor: '#53B175',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});