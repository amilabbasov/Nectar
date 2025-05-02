import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const DeliveryAddressStep = ({ address, setAddress, onNext, onPrevious }) => {
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
        <TouchableOpacity style={styles.backButton} onPress={onPrevious}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.nextButton, !address && styles.disabledButton]} 
          onPress={onNext}
          disabled={!address}
        >
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
  input: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
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
});

export default DeliveryAddressStep;