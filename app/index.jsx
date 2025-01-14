import React, { useEffect, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Animated } from "react-native";
import background from "../assets/images/background.jpg";
import { router } from "expo-router";

function Landing() {
  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideIn, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, slideIn]);

  return (
    <ImageBackground source={background} style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ translateY: slideIn }] }]}>
        <Text style={styles.tagline}>Your Journey, Your Way</Text>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeIn }]}>
        <Text style={styles.description}>
          Explore breathtaking destinations, plan your trips, and create unforgettable memories with SkyPlanner.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.buttons, { opacity: fadeIn }]}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={()=>router.replace('(tabs)/home')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonTextSecondary}>Learn More</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9ff",
    justifyContent: "center",
    padding: 20,
    objectFit: "cover",
  },
  header: {
    marginBottom: 24,
  },
  tagline: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#F7D0A9",
    // textAlign: "center",
  },
  content: {
    alignItems: "center",
    marginBottom: 48,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  description: {
    fontSize: 18,
    color: "#E8DDD2",
    // textAlign: "center",
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonPrimary: {
    backgroundColor: "#FF914D",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  buttonSecondary: {
    backgroundColor: "#FFE5D3",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextSecondary: {
    color: "#FF914D",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Landing;
