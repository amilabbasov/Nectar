import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Keyboard, Platform, Dimensions, ScrollView, ActivityIndicator, Modal, InteractionManager } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import FormInput from '../../components/common/FormInput'
import PasswordInput from '../../components/auth/PasswordInput'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../context/AuthContext'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window');

const Register = React.memo(() => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState('') // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState('')
  
  const router = useRouter()
  const { signUp } = useAuth()

  const validateUsername = React.useCallback((name) => {
    if (!name.trim()) {
      setUsernameError('Username is required')
      return false
    }
    if (name.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      return false
    }
    // Add regex check to ensure username contains only letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/
    if (!nameRegex.test(name)) {
      setUsernameError('Username must contain only letters (no numbers or special characters)')
      return false
    }
    setUsernameError('')
    return true
  }, [])

  const validateEmail = React.useCallback((email) => {
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
  }, [])

  const validatePassword = React.useCallback((password) => {
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
  }, [])

  const handleRegister = () => {
    // Clear previous errors
    setUsernameError('')
    setEmailError('')
    setPasswordError('')
    
    // Validate all inputs
    const isUsernameValid = validateUsername(username)
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      return
    }

    // Use InteractionManager to defer the heavy operation until after animations complete
    InteractionManager.runAfterInteractions(() => {
      performSignUp()
    })
  }

  const performSignUp = async () => {
    try {
      setLoading(true)
      await signUp(email.trim().toLowerCase(), password, username)
      
      // Show success modal
      setModalType('success')
      setModalMessage('Your account has been created successfully!')
      setModalVisible(true)
      
      // Delay navigation to allow users to see the success message
      setTimeout(() => {
        setModalVisible(false)
        router.replace('/(tabs)/shop')
      }, 1500)
    } catch (error) {
      console.error("Registration error:", error)
      // Show error modal
      setModalType('error')
      setModalMessage(error.message || 'Failed to create account')
      setModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={styles.background}
          source={require('../../assets/images/appItems/background.jpg')}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
                    <Text style={styles.welcomeText}>Sign Up</Text>
                    <Text style={styles.subText}>Create your new account</Text>
                  </View>
                </View>

                <View style={styles.formContainer}>
                  <FormInput
                    label="Username"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text)
                      if (usernameError) validateUsername(text)
                    }}
                    placeholder="Enter your username"
                    error={usernameError}
                  />

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

                  <Text style={styles.termsText}>
                    By continuing you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>

                  <TouchableOpacity
                    style={[styles.registerButton, loading && styles.buttonDisabled]}
                    activeOpacity={0.8}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.registerButtonText}>Sign Up</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => router.push('../')}
                    >
                      <Text style={styles.loginLink}>Login</Text>
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
              
              <Text style={styles.modalTitle}>
                {modalType === 'success' ? 'Success' : 'Registration Error'}
              </Text>
              
              <Text style={styles.modalMessage}>
                {modalMessage}
              </Text>
              
              {modalType !== 'success' && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.errorButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Try Again</Text>
                </TouchableOpacity>
              )}
              
              {modalType === 'success' && (
                <View style={styles.modalSuccessAnimation}>
                  <Ionicons name="arrow-forward-circle" size={24} color="#53B175" />
                  <Text style={styles.redirectingText}>Redirecting to home...</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </>
  )
})

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 120 : 80,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    paddingBottom: Platform.OS === 'ios' ? height * 0.08 : height * 0.04,
    marginTop: height * 0.03,
  },
  registerButton: {
    backgroundColor: '#53B175',
    borderRadius: width * 0.025,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: height * 0.03,
    shadowColor: '#53B175',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.03,
  },
  loginText: {
    color: '#181725',
    fontSize: 16,
  },
  loginLink: {
    color: '#53B175',
    fontWeight: '600',
    fontSize: 16,
  },
  termsText: {
    textAlign: 'left',
    color: '#7C7C7C',
    fontSize: 14,
    marginTop: 8,
  },
  termsLink: {
    color: '#53B175',
    fontWeight: '500',
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
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalSuccessAnimation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  redirectingText: {
    color: '#53B175',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  }
})

export default Register