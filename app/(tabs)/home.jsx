import { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Button, ActivityIndicator, Pressable, Image, FlatList, Switch, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentWeather, getForecastDays, getForecastWeather, restartState } from "../../Redux/weather/weather";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { FadeIn } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons"; 
function Home() {
  const [query, setQuery] = useState("South Africa");
  const { status, response, error } = useSelector((state) => state.weather);
  const [isDate, setIsDate] = useState(false); 
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const dispatch = useDispatch();
    const animatedSwitch = new Animated.Value(0);
  useEffect(() => {
    dispatch(restartState());
  }, []);

  useEffect(() => {
    if (status === "idle") {
      
        dispatch(getForecastDays(query)); 
    
    }
  }, [status]);

  useEffect(() => {
    if (status === "failed") {
      console.error(error?.message || "Error fetching weather data");
    }
    else if (status === "succeeded") {
      console.log(response);
    }
    else{
        return
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
      dispatch(getForecastDays(query));
    }
  };
  if (status === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF914D" />
        <Animatable.Text animation="fadeInUp" style={styles.weatherInfo}>
          Fetching weather data...
        </Animatable.Text>
      </View>
    );
  }

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

        <View style={{ flexDirection: "row",justifyContent:'space-between' ,  paddingTop: 6 }}>
          <View style={{alignItems: "flex-start" }}>
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
              style={{ width: 60, height: 60 }}
            />
            <Text style={{ fontWeight: "bold" }}>{response?.current?.condition?.text}</Text>
          </View>
        </View>
        <View style={[styles.switchContainer, { justifyContent: "space-between" }]}>
        <Pressable
            onPress={() => setIsSwitchOn(false)}
            style={[styles.switch, !isSwitchOn && { backgroundColor: "#FF914D" }]}
        >
            <Animatable.Text
            animation="fadeIn"
            style={[styles.switchText, { textAlign: "center", color: !isSwitchOn ? "#fff" : "#333" }]}
            >
            Forecast
            </Animatable.Text>
        </Pressable>
        <Pressable
            onPress={() => setIsSwitchOn(true)}
            style={[styles.switch, isSwitchOn && { backgroundColor: "#FF914D" }]}
        >
            <Animatable.Text
            animation="fadeIn"
            style={[styles.switchText, { textAlign: "center", color: isSwitchOn ? "#fff" : "#333" }]}
            >
            Activities
            </Animatable.Text>
        </Pressable>
        </View>

        {!isSwitchOn?<FlatList
          data={response?.forecast?.forecastday}
          style={{backgroundColor:'#F9FAFC', borderRadius:18, marginTop:12}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.forecastItem, {flexDirection:'row' , justifyContent:'space-between', alignItems:'center'}]}>
                <View style={{ alignItems: "flex-start" }}>
                    <Image source={{ uri: `https:${item?.day?.condition?.icon}` }} width={45} height={45}/>
                    <Text>{item?.day?.condition?.text}</Text>      
                </View>
                <View style={{jbackgroundColor:'red', alignItems: "flex-end"}}>
                    <Text>{item.date}</Text>
                    <Text style={{fontWeight:'bold'}}>{item?.day?.avgtemp_c}°C</Text> 
                </View>
            </View>
          )}
        />:
        <Animated.View
        style={{
            backgroundColor: "#F9FAFC",
            padding: 16,
            borderRadius: 18,
            marginTop: 12,
            flex: 1,
        }}
        >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            Recommended Activities based on the weather
        </Text>
        <View>
            <View style={styles.activityItem}>
            <Icon name="water-outline" size={24} style={{width:'24'}} color="#FF914D" />
            <Text style={styles.activityText}>Drink Lots of Water</Text>
            </View>
            <View style={styles.activityItem}>
            <Icon name="leaf-outline" size={24}  style={{width:'24'}} color="#FF914D" />
            <Text style={styles.activityText}>Stay Hydrated</Text>
            </View>
            <View style={styles.activityItem}>
            <Icon name="swim-outline" size={24}   style={{width:'24'}} color="#FF914D" />
            <Text style={styles.activityText}>Swim</Text>
            </View>
        </View>
        </Animated.View>}
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
    marginBottom: 6,
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
    marginVertical: 12,
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
    gap:6,
  },
  locationName: {
    fontSize: 32,
    fontWeight: "bold",
  },
  today: {
    fontSize: 24,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#FF914D",
    borderRadius: 23,
    
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
    borderRadius: 20,
    paddingHorizontal: 10,
    width:'50%'
  },
  forecastItem: {
    padding: 14,
    marginBottom:12,
    borderRadius:18,
    justifyContent:'space-between',
    borderColor:'#FF914D',
    borderWidth:2
  },
  forecastText: {
    fontSize: 16,
    color: "#333",
  },
  activityItem:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderColor:'#FF914D',
    borderWidth:1,
    padding:8,
    borderRadius:8,
    backgroundColor:'#fff'
  },
  activityText:{
    fontSize: 16,
    marginLeft: 8,
  }
});

export default Home;