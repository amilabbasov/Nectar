import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import FormInput from '../common/FormInput'

const PasswordInput = ({ value, onChangeText, showPassword, setShowPassword, error }) => {
  return (
    <View style={styles.passwordContainer}>
      <FormInput
        label="Password"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        placeholder="Enter your password"
        error={error}
      />
      <TouchableOpacity 
        onPress={() => setShowPassword(!showPassword)}
        style={styles.eyeIcon}
      >
        <Ionicons 
          name={showPassword ? "eye-outline" : "eye-off-outline"} 
          size={24} 
          color="#7C7C7C" 
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: '45%',
  },
})

export default PasswordInput