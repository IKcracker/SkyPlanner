import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ImageBackground, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import background from "../../assets/images/background.jpg";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://skyplanner-api-1.onrender.com/api/users/login', { email, password });
      await AsyncStorage.setItem('token', response.data.token);
      Alert.alert('Success', 'Logged in successfully');
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={background} style={styles.background}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FF914D" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Animatable.Text animation="fadeInDown" duration={1500} style={styles.headerText}>
              Welcome Back
            </Animatable.Text>
            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={20} color="#333" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>
            <Animatable.View animation="fadeInUp" duration={1500}>
              <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.loginButton]} onPress={() => router.push('/register')}>
                <Text style={[styles.buttonText, { color: '#FF914D' }]}>Create New Account</Text>
              </Pressable>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

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
  loadingOverlay: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 8,
    color: '#fff',
  },
});

export default LoginScreen;