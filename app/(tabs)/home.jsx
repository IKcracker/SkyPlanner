import { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Button, ActivityIndicator, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentWeather } from "../../Redux/weather/weather";

function Home() {
  const [query, setQuery] = useState("South Africa");
  const { status, respond, error } = useSelector((state) => state.weather);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(getCurrentWeather(query));
    }
  }, [status]);

  useEffect(() => {
    if (status === "failed") {
      console.error(error?.message || "Error fetching weather data");
    }
  }, [status]);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(getCurrentWeather(query));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, user</Text>
        <Text style={styles.subtitle}>Let's start your vacation!</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
        style={styles.input}
        placeholder="Enter your location"
        placeholderTextColor="#AAA"
        value={query}
        onChangeText={(text) => setQuery(text)}
        onSubmitEditing={handleSearch}
        />

        <Pressable
        style={({ pressed }) => [
            styles.buttons,
            styles.buttonPrimary,
            pressed && { backgroundColor: "#FF7A30" }, // Slightly darker on press
        ]}
        onPress={handleSearch}
        >
        <Text style={styles.buttonText}>Search</Text>
        </Pressable>

      </View>
      <View style={styles.content}>
        {status === "loading" && <ActivityIndicator size="large" color="#FDC185" />}
        {status === "succeeded" && respond && (
          <Text style={styles.weatherInfo}>
            {`The weather in ${respond.location.name}, ${respond.location.country} is ${respond.current.condition.text} with a temperature of ${respond.current.temp_c}°C.`}
          </Text>
        )}
        {status === "failed" && <Text style={styles.error}>{error?.message || "Something went wrong"}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    marginBottom:12
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 34,
    borderColor: "#E8DDD2",
    marginVertical: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherInfo: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#FF914D",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default Home;
