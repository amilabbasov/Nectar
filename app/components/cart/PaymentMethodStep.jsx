import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentMethodStep = ({ paymentMethod, setPaymentMethod, onNext, onPrevious }) => {
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
        <TouchableOpacity style={styles.backButton} onPress={onPrevious}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 20,
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
});

export default PaymentMethodStep;