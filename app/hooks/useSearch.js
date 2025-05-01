import { useState, useCallback } from 'react';

export const useSearch = (initialData) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);

  const handleSearch = useCallback((query, data) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredData(data);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    const filtered = data.filter(item => {
      const itemName = item.name.toLowerCase();
      const itemCategory = item.category?.toLowerCase() || '';
      const itemCategoryType = item.categoryType?.toLowerCase() || '';
      const itemWeight = item.weight?.toLowerCase() || '';
      const itemVolume = item.volume?.toLowerCase() || '';
      const itemQuantity = item.quantity?.toLowerCase() || '';
      const itemPieces = item.pieces?.toLowerCase() || '';

      // Check if any field contains the search term
      const matches = 
        itemName.includes(searchTerm) ||
        (itemCategory && itemCategory.includes(searchTerm)) ||
        itemWeight.includes(searchTerm) ||
        itemVolume.includes(searchTerm) ||
        itemQuantity.includes(searchTerm) ||
        itemPieces.includes(searchTerm);

      return matches;
    });

    setFilteredData(filtered);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    setFilteredData,
    handleSearch
  };
}; 

export default useSearch;