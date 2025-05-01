import React, { useState } from 'react';
import { INITIAL_COUNTRIES } from '../app/data/locationData';

export const useLocation = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [cities, setCities] = useState([]);

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

    return {
        countries,
        cities,
        selectedCountry,
        loading: false,
        error: null,
        handleCountrySelect
    };
};