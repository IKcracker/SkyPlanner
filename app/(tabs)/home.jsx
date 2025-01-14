import { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Button, ActivityIndicator, Pressable, Image, FlatList, Switch, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentWeather, getForecastDays, getForecastWeather, restartState } from "../../Redux/weather/weather";
import { FontAwesome6 } from "@expo/vector-icons";

function Home() {
  const [query, setQuery] = useState("South Africa");
  const { status, response, error } = useSelector((state) => state.weather);
  const [isDate, setIsDate] = useState(false); // Track whether to show daily or hourly forecast
  const [isSwitchOn, setIsSwitchOn] = useState(false); // Toggle between days and hours
  const dispatch = useDispatch();

  const animatedSwitch = new Animated.Value(isSwitchOn ? 1 : 0); // For smooth transition

  useEffect(() => {
    dispatch(restartState());
  }, []);

  useEffect(() => {
    if (status === "idle") {
      if (isDate) {
        dispatch(getForecastWeather(query)); // Get forecast for hours
      } else {
        dispatch(getForecastDays(query)); // Get forecast for days
      }
    }
  }, [status]);

  useEffect(() => {
    if (status === "failed") {
      console.error(error?.message || "Error fetching weather data");
    }
  }, [status]);

  useEffect(() => {
    Animated.timing(animatedSwitch, {
      toValue: isSwitchOn ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSwitchOn]);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(getCurrentWeather(query));
    }
  };

  const toggleSwitch = () => {
    setIsSwitchOn(previousState => !previousState);
    setIsDate(!isSwitchOn); // Switch between daily and hourly forecast
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
            pressed && { backgroundColor: "#FF7A30" },
          ]}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.heading}>
          <View style={styles.location}>
            <FontAwesome6 name="location-dot" color="#FF914D" size={32} />
            <Text style={styles.locationName}>{response?.location?.name || query}</Text>
          </View>
          <View style={styles.current}>
            <Text style={styles.today}>Today</Text>
            <Text style={styles.time}>{response?.location?.localtime.split(" ")[1]}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", paddingVertical: 24 }}>
          <View style={{ width: "75%" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Feels Like</Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <Text style={{ fontSize: 46, fontWeight: "bold", width: "100" }}>
                {response?.current?.feelslike_c}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>C°</Text>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: `https:${response?.current?.condition?.icon}` }}
              style={{ width: 100, height: 80 }}
            />
            <Text style={{ fontWeight: "bold" }}>{response?.current?.condition?.text}</Text>
          </View>
        </View>

        <FlatList
          data={isSwitchOn ? response?.forecast?.forecastday[0]?.hour : response?.forecast?.forecastday}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.forecastItem, {flexDirection:'row' , justifyContent:'space-between', alignItems:'center'}]}>
            {console.log(`https:${item?.day?.condition?.icon}` )}
                <View style={{width:'70%'}}>
                    <Image source={{ uri: `https:${item?.day?.condition?.icon}` }} width={45} height={45}/>
                    <Text>{item?.day?.condition?.text}</Text>
                    
                </View>
              <View style={{justifyContent:'space-between'}}>
              <Text>{item.date}</Text>
              <Text style={{width:'225' , fontWeight:'bold'}}>{item?.day?.avgtemp_c}°C</Text> 
              </View>
            </View>
          )}
        />
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
    marginBottom: 12,
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
    marginVertical: 18,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 18,
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
  heading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationName: {
    fontSize: 32,
    fontWeight: "bold",
  },
  today: {
    fontSize: 24,
    fontWeight: "bold",
  },
  time: {},
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  switchText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  switchLabel: {
    fontSize: 16,
    color: "#555",
  },
  switch: {
    transform: [{ translateX: 0 }],
    padding: 5,
    backgroundColor: "#FF914D",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  forecastItem: {
    padding: 14,
    backgroundColor:'#E8DDD2',
    marginBottom:12,
    borderRadius:18
  },
  forecastText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Home;
