import { View, Text, TouchableOpacity, Modal, Animated, StatusBar, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const AuthModal = ({ 
  visible, 
  onClose, 
  onSignIn, 
  onSignUp, 
  animatedValues: { fadeAnim, slideAnim } 
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
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.dismissArea} 
            onPress={onClose}
            activeOpacity={1}
          />
          
          <Animated.View 
            style={[
              styles.authModalContent,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.authModalContainer}>
              <View style={styles.authModalIconContainer}>
                <Ionicons name="lock-closed" size={50} color="#53B175" />
              </View>
              <Text style={styles.authModalTitle}>Sign In Required</Text>
              <Text style={styles.authModalText}>
                Please sign in or create an account to complete your purchase.
              </Text>
              <TouchableOpacity 
                style={styles.authModalButton} 
                onPress={onSignIn}
              >
                <Text style={styles.authModalButtonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.authModalSignupButton} 
                onPress={onSignUp}
              >
                <Text style={styles.authModalSignupText}>Create an Account</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.authModalCancelButton} 
                onPress={onClose}
              >
                <Text style={styles.authModalCancelText}>Cancel</Text>
              </TouchableOpacity>
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
  authModalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authModalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  authModalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(83, 177, 117, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  authModalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 16,
    textAlign: 'center',
  },
  authModalText: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  authModalButton: {
    backgroundColor: '#53B175',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  authModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  authModalSignupButton: {
    backgroundColor: '#F2F3F2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  authModalSignupText: {
    color: '#53B175',
    fontSize: 16,
    fontWeight: '600',
  },
  authModalCancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  authModalCancelText: {
    color: '#7C7C7C',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AuthModal;