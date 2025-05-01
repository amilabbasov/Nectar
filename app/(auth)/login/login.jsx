import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Keyboard, Platform, Dimensions, ScrollView, ActivityIndicator, Modal } from 'react-native'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import FormInput from '../../components/common/FormInput'
import PasswordInput from '../../components/auth/PasswordInput'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../context/AuthContext'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window');

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState('') // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState('')
  
  const router = useRouter()
  const { signIn } = useAuth()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required')
      return false
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError('')
    setPasswordError('')
    
    // Validate inputs
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    if (!isEmailValid || !isPasswordValid) {
      return
    }

    try {
      setLoading(true)
      await signIn(email, password)
      // Show success modal
      setModalType('success')
      setModalMessage('Login successful! Redirecting to home...')
      setModalVisible(true)
      
      // Delay navigation to allow users to see the success message
      setTimeout(() => {
        setModalVisible(false)
        router.replace('/(tabs)/shop')
      }, 1500)
    } catch (error) {
      // Show error modal
      setModalType('error')
      setModalMessage(error.message || 'Failed to sign in')
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    setModalType('info')
    setModalMessage('Password reset instructions have been sent to your email.')
    setModalVisible(true)
  }

  return (
    <>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../assets/images/appItems/background.jpg')}
          style={styles.background}
          resizeMode="cover"
          imageStyle={{ opacity: 0.5 }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <View style={styles.container} onStartShouldSetResponder={() => Keyboard.dismiss()}>
                <View style={styles.logoContainer}>
                  <Image
                    source={require('../../assets/images/appItems/carrot-colorful.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Login</Text>
                    <Text style={styles.subText}>Enter your email and password</Text>
                  </View>
                </View>

                <View style={styles.formContainer}>
                  <FormInput
                    label="Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      if (emailError) validateEmail(text)
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter your email"
                    error={emailError}
                  />

                  <PasswordInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text)
                      if (passwordError) validatePassword(text)
                    }}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    error={passwordError}
                  />

                  <TouchableOpacity style={{ alignSelf: 'flex-end' }} activeOpacity={0.6} onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.loginButton, loading && styles.buttonDisabled]}
                    activeOpacity={0.8}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.loginButtonText}>Log In</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/(auth)/register/register')}>
                      <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
        
        {/* Custom Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {modalType === 'success' && (
                <View style={[styles.modalIconContainer, styles.successIconContainer]}>
                  <Ionicons name="checkmark-circle" size={60} color="#53B175" />
                </View>
              )}
              
              {modalType === 'error' && (
                <View style={[styles.modalIconContainer, styles.errorIconContainer]}>
                  <Ionicons name="close-circle" size={60} color="#FF4B4B" />
                </View>
              )}
              
              {modalType === 'info' && (
                <View style={[styles.modalIconContainer, styles.infoIconContainer]}>
                  <Ionicons name="information-circle" size={60} color="#3498db" />
                </View>
              )}
              
              <Text style={styles.modalTitle}>
                {modalType === 'success' ? 'Success' : modalType === 'error' ? 'Error' : 'Information'}
              </Text>
              
              <Text style={styles.modalMessage}>
                {modalMessage}
              </Text>
              
              {modalType !== 'success' && (
                <TouchableOpacity
                  style={[styles.modalButton, modalType === 'error' ? styles.errorButton : styles.infoButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: height * 0.08,
    marginBottom: height * 0.02,
  },
  logo: {
    width: 47,
    height: 55,
    marginBottom: 20,
  },
  welcomeContainer: {
    width: '105%',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#181725',
    marginTop: 15,
  },
  subText: {
    fontSize: 16,
    color: '#7C7C7C',
    marginTop: 5,
  },
  formContainer: {
    paddingHorizontal: width * 0.02,
    justifyContent: 'flex-start',
    paddingBottom: Platform.OS === 'ios' ? height * 0.05 : height * 0.02,
    marginTop: height * 0.03,
  },
  inputContainer: {
    marginVertical: height * 0.015,
  },
  inputLabel: {
    color: '#7C7C7C',
    fontSize: 15,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: height * 0.06,
    borderColor: '#E2E2E2',
    borderBottomWidth: 1,
    borderRadius: width * 0.025,
    padding: width * 0.04,
    fontSize: width * 0.04,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  forgotPassword: {
    color: '#181725',
    marginTop: height * 0.015,
    marginBottom: height * 0.03,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#53B175',
    borderRadius: width * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    shadowColor: '#53B175',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.03,
  },
  signupText: {
    color: '#181725',
    fontSize: 16,
  },
  signupLink: {
    color: '#53B175',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successIconContainer: {
    backgroundColor: 'rgba(83, 177, 117, 0.1)',
  },
  errorIconContainer: {
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
  },
  infoIconContainer: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  errorButton: {
    backgroundColor: '#FF4B4B',
  },
  infoButton: {
    backgroundColor: '#3498db',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  }
})

export default Login