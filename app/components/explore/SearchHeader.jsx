import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const SearchHeader = ({ searchQuery, onSearchChange, onFilterPress, title = "Find Products" }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/images/appItems/search.png')}
          style={styles.searchIcon}
          contentFit="contain"
        />
        <TextInput
          placeholder="Search Store"
          style={styles.searchInput}
          placeholderTextColor="#7C7C7C"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#181725" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#181725',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#000000',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    paddingLeft: 10,
  },
  filterButton: {
    padding: 8,
  },
});

export default SearchHeader;