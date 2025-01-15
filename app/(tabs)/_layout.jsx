import { View } from "react-native";
import { Tabs } from "expo-router";

function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
      <Tabs.Screen name="map" options={{ headerShown: false }} />
    </Tabs>
  );
}

export default Layout;
