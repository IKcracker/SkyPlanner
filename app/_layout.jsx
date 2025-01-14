import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from '../Redux/store'
function Layout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{
          headerShown: false
        }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        {/* <Stack.Screen name="login" />
        <Stack.Screen name="register" /> */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}

export default Layout;