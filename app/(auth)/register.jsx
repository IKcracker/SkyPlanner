import React, { useState, useEffect } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground,  
    Animated, 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; 
import background from "../../assets/images/background.jpg"; 
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';

const RegisterScreen = () => {
    const [input, setInput] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const router = useRouter();
    
    const [fadeAnim] = useState(new Animated.Value(0)); 
    const [slideAnim] = useState(new Animated.Value(30)); 

    const handleInputChange = (field, value) => {
        setInput((prev) => ({ ...prev, [field]: value }));
    };

    const handleRegister = async () => {
        const { name, email, password, confirmPassword } = input;

        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        try {
            await axios.post('https://skyplanner-api-1.onrender.com/api/users/register', { name, email, password });
            Alert.alert('Success', 'Registration successful');
            router.push('/login');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errorMessages = error.response.data.errors
                    .map((err) => err.msg)
                    .join('\n');
                Alert.alert('Error', errorMessages);
            } else {
                Alert.alert('Error', error.response?.data?.msg || 'Something went wrong');
            }
        }
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1, 
            duration: 1500,
            useNativeDriver: true,
        }).start();

        Animated.timing(slideAnim, {
            toValue: 0, 
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground source={background} style={styles.background}> 
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <Animatable.Text animation="fadeInDown" duration={1500} style={styles.headerText}>
                            Create Your Account
                        </Animatable.Text>
                        <Animatable.Text animation="fadeInDown" duration={1500} style={styles.subHeaderText}>
                            Join us and experience premium services tailored for you.
                        </Animatable.Text>

                        <View style={styles.inputGroup}>
                            <Icon name="person" size={20} color="#fff" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#aaa"
                                value={input.name}
                                onChangeText={(value) => handleInputChange("name", value)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Icon name="email" size={20} color="#fff" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#aaa"
                                value={input.email}
                                keyboardType="email-address"
                                onChangeText={(value) => handleInputChange("email", value)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Icon name="lock" size={20} color="#fff" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#aaa"
                                value={input.password}
                                secureTextEntry={true}
                                onChangeText={(value) => handleInputChange("password", value)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Icon name="lock-outline" size={20} color="#fff" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="#aaa"
                                value={input.confirmPassword}
                                secureTextEntry={true}
                                onChangeText={(value) => handleInputChange("confirmPassword", value)}
                            />
                        </View>

                        <Animatable.View animation="fadeInUp" duration={1500}>
                            <Pressable style={styles.button} onPress={handleRegister}>
                                <Text style={styles.buttonText}>Create Account</Text>
                            </Pressable>
                            <Pressable style={[styles.button, styles.loginButton]} onPress={() => router.push('/login')}>
                                <Text style={[styles.buttonText, { color: '#FF914D' }]}>Already have an Account? Click here</Text>
                            </Pressable>
                        </Animatable.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    subHeaderText: {
        fontSize: 16,
        color: "#fff",
        textAlign: 'center',
        marginBottom: 30,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        padding: 10,
    },
    button: {
        backgroundColor: '#FF914D',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    loginButton: {
        backgroundColor: 'transparent',
        borderColor: '#FF914D',
        borderWidth: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;