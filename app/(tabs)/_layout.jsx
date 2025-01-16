import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#fff" }, // Customize the tab bar background
        tabBarShowLabel: false, // Hide tab labels
        tabBarActiveTintColor: "#FF914D", // Active tab color
        tabBarInactiveTintColor: "#999", // Inactive tab color
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size || 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size || 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map" color={color} size={size || 24} />
          ),
        }}
      />
    </Tabs>
  );
}

export default Layout;
