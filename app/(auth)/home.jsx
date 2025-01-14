import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import background from "../../assets/images/background.jpg";

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setUser({ name: 'John Doe' });
      } else {
        router.replace('/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <ImageBackground source={background} style={styles.container}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>Welcome, {user.name}</Text>
          <Button title="Logout" onPress={handleLogout} color="#FF914D" />
        </>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: "#F7D0A9",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#E8DDD2",
  },
});

export default HomeScreen;