import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 

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
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>Welcome, {user.name}</Text>
          <Button title="Logout" onPress={handleLogout} color="#FF914D" />
        </>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f9ff",
  },
  welcomeText: {
    fontSize: 24,
    color: "#333",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
});

export default HomeScreen;
