import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Platform,
    Animated,
    Easing,
    ScrollView,
    TouchableWithoutFeedback,
    Modal
} from 'react-native';
import { Image } from 'expo-image';
import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocationContext } from '../context/LocationContext';
const { SafeAreaView } = require('../components/common');

const ModernDropdown = ({ data, placeholder, onSelect, selectedItem, disabled, isArea = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownAnimation = useRef(new Animated.Value(0)).current;
    const opacityAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(0.95)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    const rotate = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    const isItemSelected = (item) => {
        if (!selectedItem) return false;
        
        if (!isArea && item.code && selectedItem.code) {
            return item.code === selectedItem.code;
        }
        
        if (isArea && item.id && selectedItem.id) {
            return item.id === selectedItem.id;
        }
        
        return false;
    };

    const closeDropdown = () => {
        if (isOpen) setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.timing(opacityAnimation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.spring(scaleAnimation, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true
                }),
                Animated.timing(rotateAnimation, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.ease,
                    useNativeDriver: true
                }),
                Animated.spring(dropdownAnimation, {
                    toValue: 1,
                    friction: 8,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacityAnimation, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.spring(scaleAnimation, {
                    toValue: 0.95,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true
                }),
                Animated.timing(rotateAnimation, {
                    toValue: 0,
                    duration: 150,
                    easing: Easing.ease,
                    useNativeDriver: true
                }),
                Animated.timing(dropdownAnimation, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [isOpen]);

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (item) => {
        onSelect(item);
        setIsOpen(false);
    };

    const translateY = dropdownAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-5, 0]
    });

    return (
        <View style={styles.dropdownContainer}>
            <TouchableWithoutFeedback onPress={toggleDropdown}>
                <Animated.View style={[
                    styles.dropdownButton,
                    disabled && styles.dropdownButtonDisabled,
                    { transform: [{ scale: disabled ? 1 : scaleAnimation }] }
                ]}>
                    <Text style={{ fontSize: 24 }}>
                        {selectedItem ? selectedItem.icon : '🌍'}
                    </Text>
                    <Text style={[
                        styles.dropdownButtonText,
                        disabled && styles.dropdownButtonTxtDisabled
                    ]}>
                        {(selectedItem && selectedItem.title) || placeholder}
                    </Text>
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <Icon
                            name={'chevron-down'}
                            style={[
                                styles.dropdownButtonIcon,
                                disabled && styles.dropdownButtonArrowDisabled
                            ]}
                        />
                    </Animated.View>
                </Animated.View>
            </TouchableWithoutFeedback>
            
            <Modal
                visible={isOpen}
                transparent
                animationType="none"
                onRequestClose={closeDropdown}
            >
                <TouchableWithoutFeedback onPress={closeDropdown}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <Animated.View 
                                style={[
                                    styles.dropdownList,
                                    isArea ? styles.dropdownListSmall : {},
                                    {
                                        opacity: opacityAnimation,
                                        transform: [
                                            { translateY },
                                            { scale: scaleAnimation }
                                        ],
                                    }
                                ]}
                            >
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={{ maxHeight: isArea ? 190 : 300 }}
                                >
                                    {data?.map((item, index) => {
                                        const selected = isItemSelected(item);
                                        
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleSelect(item)}
                                                style={[
                                                    styles.dropdownItem,
                                                    selected && styles.dropdownItemSelected
                                                ]}
                                            >
                                                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                                                <Text style={styles.dropdownItemText}>{item.title}</Text>
                                                {selected && (
                                                    <Icon name="check" style={styles.dropdownItemCheck} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const ChangeLocation = () => {
    const router = useRouter();
    const {
        countries,
        cities,
        selectedCountry,
        selectedCity,
        loading,
        error,
        handleCountrySelect,
        handleCitySelect
    } = useLocationContext();

    const buttonScale = useRef(new Animated.Value(1)).current;
    const buttonOpacity = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(buttonScale, {
                toValue: 0.95,
                friction: 5,
                useNativeDriver: true
            }),
            Animated.timing(buttonOpacity, {
                toValue: 0.9,
                duration: 150,
                useNativeDriver: true
            })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(buttonScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true
            }),
            Animated.timing(buttonOpacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true
            })
        ]).start();
    };

    const handleBackButton = () => {
        router.back();
    };

    const handleContinue = () => {
        router.push('../');
    };

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ImageBackground
            style={styles.background}
            source={require('./assets/images/appItems/background.jpg')}
        >
            <StatusBar style="dark" />
            <SafeAreaView
                style={styles.safeArea}
                edges={['top', 'bottom']}
            >
                <View style={[
                    styles.container,
                    Platform.OS === 'android' && { paddingTop: 16 }
                ]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackButton}
                    >
                        <Image
                            source={require('./assets/images/appItems/goBack.png')}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>

                    {/* Header Content */}
                    <View style={styles.content}>
                        <Image
                            source={require('./assets/images/appItems/locationIcon.png')}
                            style={styles.image}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Change Your Location</Text>
                            <Text style={styles.description}>
                                Update your location to see delivery options for your area
                            </Text>
                        </View>
                    </View>

                    <View style={styles.dropdownsContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#53B175" />
                        ) : (
                            <>
                                <View style={{ zIndex: 2, position: 'relative', width: '100%' }}>
                                    <Text style={styles.dropdownLabel}>Your Zone</Text>
                                    <ModernDropdown
                                        data={countries}
                                        placeholder="Select country"
                                        onSelect={handleCountrySelect}
                                        selectedItem={selectedCountry}
                                        isArea={false}
                                    />
                                </View>

                                <View style={{ zIndex: 1, position: 'relative', marginTop: 16, width: '100%' }}>
                                    <Text style={styles.dropdownLabel}>Your Area</Text>
                                    <ModernDropdown
                                        data={cities}
                                        placeholder="Select city"
                                        onSelect={handleCitySelect}
                                        disabled={!selectedCountry}
                                        selectedItem={selectedCity}
                                        isArea={true}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                (!selectedCountry || !selectedCity) && { opacity: 0.5 }
                            ]}
                            disabled={!selectedCountry || !selectedCity}
                            onPress={handleContinue}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                        >
                            <Animated.View style={{
                                transform: [{ scale: buttonScale }],
                                opacity: buttonOpacity,
                                width: '100%',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.buttonText}>Update Location</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '10%',
    },
    backButton: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: 40,
        height: 40,
    },
    backIcon: {
        width: 10,
        height: 18,
    },
    button: {
        backgroundColor: '#53B175',
        paddingVertical: 16,
        borderRadius: 19,
        width: '100%',
        marginTop: 24,
        alignItems: 'center',
        shadowColor: '#53B175',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonContainer: {
        width: '85%',
        marginTop: 24,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5%',
        marginTop: '15%',
        width: '85%',
    },
    image: {
        width: 224.69,
        height: 170.69,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: '1%',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        color: '#181725',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        color: '#7C7C7C',
        textAlign: 'center',
        lineHeight: 20,
    },
    dropdownsContainer: {
        width: '85%',
        gap: 16,
        marginTop: '10%',
        alignItems: 'center',
    },
    dropdownLabel: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 10,
        color: 'rgba(124, 124, 124, 1)',
    },

    // Modern Dropdown Styles
    dropdownContainer: {
        width: '100%',
        position: 'relative',
        zIndex: 1,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderColor: 'rgba(226, 226, 226, 1)',
    },
    dropdownButtonText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 8,
        color: '#181725',
    },
    dropdownButtonIcon: {
        fontSize: 20,
        color: '#181725',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    dropdownList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '85%',
        maxHeight: 300,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    dropdownListSmall: {
        maxHeight: 190,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e6e6e6',
    },
    dropdownItemSelected: {
        backgroundColor: 'rgba(83, 177, 117, 0.1)',
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 16,
        color: '#181725',
        marginLeft: 12,
    },
    dropdownItemCheck: {
        fontSize: 18,
        color: '#53B175',
        marginLeft: 5,
    },

    // Error and disabled styles
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    dropdownButtonDisabled: {
        opacity: 0.6,
    },
    dropdownButtonTxtDisabled: {
        color: '#7C7C7C',
    },
    dropdownButtonArrowDisabled: {
        color: '#7C7C7C',
    },
});

export default ChangeLocation;