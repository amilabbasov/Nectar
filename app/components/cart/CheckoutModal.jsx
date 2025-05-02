import React from 'react';
import { View, Text, Modal, Animated, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StatusBar, StyleSheet, Keyboard } from 'react-native';
import DeliveryAddressStep from './DeliveryAddressStep';
import PaymentMethodStep from './PaymentMethodStep';
import OrderSummaryStep from './OrderSummaryStep';
import OrderProcessingStep from './OrderProcessingStep';
import OrderCompleteStep from './OrderCompleteStep';

const CheckoutModal = ({
  visible,
  onClose,
  currentStep,
  address,
  setAddress,
  paymentMethod,
  setPaymentMethod,
  processing,
  orderComplete,
  handleNextStep,
  handlePreviousStep,
  handlePlaceOrder,
  totalAmount,
  deliveryFee,
  tax,
  finalTotal,
  animatedValues: { fadeAnim, slideAnim },
  modalPosition
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.dismissArea} 
            onPress={onClose}
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
                {processing ? (
                  <OrderProcessingStep />
                ) : orderComplete ? (
                  <OrderCompleteStep onClose={onClose} />
                ) : (
                  <>
                    {currentStep === 1 && (
                      <DeliveryAddressStep 
                        address={address} 
                        setAddress={setAddress}
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                      />
                    )}
                    {currentStep === 2 && (
                      <PaymentMethodStep 
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        onNext={handleNextStep}
                        onPrevious={handlePreviousStep}
                      />
                    )}
                    {currentStep === 3 && (
                      <OrderSummaryStep 
                        totalAmount={totalAmount}
                        deliveryFee={deliveryFee}
                        tax={tax}
                        finalTotal={finalTotal}
                        address={address}
                        paymentMethod={paymentMethod}
                        onPrevious={handlePreviousStep}
                        onPlaceOrder={handlePlaceOrder}
                      />
                    )}
                  </>
                )}
              </ScrollView>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dismissArea: {
    flex: 1,
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
  modalContainer: {
    flex: 1,
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
});

export default CheckoutModal;