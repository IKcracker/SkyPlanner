import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://skyplanner-api-1.onrender.com/users/login', { email, password });
      await AsyncStorage.setItem('token', response.data.token);
      Alert.alert('Success', 'Logged in successfully');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', error.response.data.msg || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#FF914D" />
      <Button title="Don't have an account? Register" onPress={() => navigation.navigate('register')} color="#FFE5D3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: "#f5f9ff",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: "#fff",
  },
});

export default LoginScreen;