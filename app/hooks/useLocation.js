import { useState } from 'react';
import { INITIAL_COUNTRIES } from '../data/locationData';

export const useLocation = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [loading, setLoading] = useState(false);

    const countries = Object.entries(INITIAL_COUNTRIES).map(([code, data]) => ({
        code,
        title: data.title,
        icon: data.icon
    }));

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        const countryCities = INITIAL_COUNTRIES[country.code]?.cities || [];
        setCities(countryCities);
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
    };

    const error = null;
    

    return {
        countries,
        cities,
        selectedCountry,
        selectedCity,
        loading,
        error,
        handleCountrySelect,
        handleCitySelect
    };    
};

export default useLocation;