import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function MyDetailsScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(''); // You could add phone to your user object later
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Get existing users
      const USERS_STORAGE_KEY = 'nectar_users';
      const USER_STORAGE_KEY = 'nectar_user';
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      let users = usersData ? JSON.parse(usersData) : {};
      
      // Update the user info
      if (users[user?.email]) {
        const updatedUser = {
          ...users[user?.email],
          name: name.trim(),
          // We're not updating email as it would require additional logic for auth
        };
        
        users[user?.email] = updatedUser;
        
        // Update users storage
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        
        // Update current user
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        
        // Reload the app to reflect changes
        Alert.alert('Success', 'Your details have been updated', [
          { 
            text: 'OK', 
            onPress: () => router.push('/(tabs)/account') // Redirect to account tab specifically
          }
        ]);
      }
      
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert('Error', 'Failed to update details. Please try again.');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#53B175" />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'My Details',
          headerShown: false
        }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#181725" />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>My Details</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, isEditing ? styles.inputActive : null]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                editable={isEditing}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                placeholder="Your email address"
                editable={false} // Email should not be editable as it's used for auth
                placeholderTextColor="#7C7C7C"
              />
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, isEditing ? styles.inputActive : null]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Add a phone number (optional)"
                editable={isEditing}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </ScrollView>
        
        {/* Save button for mobile UX */}
        {isEditing && (
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  backButton: {
    padding: 5,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181725',
  },
  editButton: {
    padding: 5,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#53B175',
  },
  formContainer: {
    padding: 20,
  },
  formField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#7C7C7C',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#181725',
    backgroundColor: '#F2F3F2',
  },
  inputActive: {
    borderColor: '#53B175',
    backgroundColor: '#FFFFFF',
  },
  helperText: {
    fontSize: 12,
    color: '#7C7C7C',
    marginTop: 5,
    marginLeft: 5,
  },
  saveButtonContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  saveButton: {
    backgroundColor: '#53B175',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});