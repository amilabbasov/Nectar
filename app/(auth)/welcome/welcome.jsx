import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {Image} from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const Welcome = () => {
    const router = useRouter();

    return (
        <ImageBackground
            source={require('../../assets/images/appItems/welcomeBg.png')}
            style={styles.background}
        >
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Image
                        source={require('../../assets/images/appItems/carrot.png')}
                        style={styles.logo}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Welcome</Text>
                        <Text style={styles.title}>to our store</Text>
                        <Text style={styles.subtitle}>
                            Get your groceries in as fast as one hour
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/location/location')}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 80,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 48.47,
        height: 56.36,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    title: {
        fontSize: 47,
        color: '#ffffff',
        letterSpacing: 1,
        textAlign: 'center',
        fontWeight: '600',
    },
    subtitle: {
        color: 'rgba(252, 252, 252, 0.7)',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        maxWidth: 300,
    },
    button: {
        backgroundColor: '#53B175',
        paddingHorizontal: 130,
        paddingVertical: 17,
        borderRadius: 19,
        marginTop: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Welcome;