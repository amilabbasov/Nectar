import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const { width, height } = Dimensions.get('window')

const FormInput = ({ label, error, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          props.style,
          error ? styles.inputError : null
        ]}
        placeholderTextColor="#B1B1B1"
        {...props}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
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
  inputError: {
    borderColor: '#FF4B4B',
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 12,
    marginTop: 4,
  }
})

export default FormInput
