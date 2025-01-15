import { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, ActivityIndicator, Pressable, Image, FlatList, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getForecastDays, restartState, setSearchedLocation  } from "../../Redux/weather/weather";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';

import { FadeIn } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addFavorates, getUser, removeFavorates } from "../../Redux/user/userSlice";
import { getActions } from "../../Redux/activities/activities";

function Home() {
  const [query, setQuery] = useState("South Africa");
  const { status, response, error } = useSelector((state) => state.weather);
  const USER = useSelector(state => state.user)
  const Activities = useSelector(state => state.activities)
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const dispatch = useDispatch();
  const animatedSwitch = new Animated.Value(0);
  const [favorite, setFavorite] = useState(false);
  const [user , setUser] = useState('')
 useEffect(() => {
    dispatch(restartState());
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getForecastDays(query));
      dispatch(getUser());
      dispatch(getActions())
    }
  }, [status]);

  useEffect(() => {
    if (status === "failed" || USER.status === 'failed') {
      console.log(error || USER.error);
    }
  }, [status, USER.status]);

  useEffect(() => {
    if (USER.status === 'succeeded') {
      setUser(USER?.response?.name || 'User');
    }
  }, [USER.status]);

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
      dispatch(setSearchedLocation(query)); 
    }
  };

  const handleAddFavorite = () => {
    if(!favorite)
    {
      if (response?.location) {
      const locationName = response.location.name;
      const id = USER?.response?._id;
      const data = { locationName, id };
      dispatch(addFavorates(data));
      setFavorite(state => !state);
    }
    }
  
  };

  if (status === "loading" && USER.status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF914D" />
        <Animatable.Text animation="fadeInUp" style={{ fontSize: 24, fontWeight: 'bold' }}>
          Fetching weather data...
        </Animatable.Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.greeting}>Hi, {user || 'User'}</Text>
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
        <Animatable.View animation='fadeIn' delay={2000} duration={2000} style={[styles.switchContainer, { justifyContent: "space-between" }]}>
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
        </Animatable.View>

     {!isSwitchOn ? <View style={styles.content}>
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

        <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingTop: 6 }}>
          <Animatable.View animation='fadeInLeft' duration={2000} style={{ alignItems: "flex-start" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Feels Like</Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <Text style={{ fontSize: 46, fontWeight: "bold", width: "100" }}>
                {response?.current?.feelslike_c}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>C°</Text>
            </View>
          </Animatable.View>
          <Animatable.View animation='fadeInRight' duration={2000} style={{ alignItems: "flex-end" }}>
            <Image
              source={{ uri: `https:${response?.current?.condition?.icon}` }}
              style={{ width: 60, height: 60  , backgroundColor:'#F9FAFC'}}
            />
            <Text style={{ fontWeight: "bold" }}>{response?.current?.condition?.text}</Text>
          </Animatable.View>
        </View>
        <Animatable.View style={{flexDirection:"row" , justifyContent:'space-between', alignItems:'center', paddingVertical:12}}>
            <Animatable.Text style={{fontSize:16}}>Save to favorite</Animatable.Text>
            <Pressable style={{paddingRight:6}} onPress={handleAddFavorite}>
            <FontAwesome6 name={favorite? 'heart-circle-check':'heart' }size={32} color='#FF914D' />
            </Pressable>
            
        </Animatable.View>

        <FlatList
          data={response?.forecast?.forecastday}
          style={{ backgroundColor: '#F9FAFC', borderRadius: 18, marginTop: 12 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (

            <Animatable.View animation='fadeInRight' duration={2000} style={[styles.forecastItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
              <View style={{ alignItems: "flex-start" }}>
                <Image source={{ uri: `https:${item?.day?.condition?.icon}` }} width={45} height={45} />
                <Text>{item?.day?.condition?.text}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text>{item.date}</Text>
                <Text style={{ fontWeight: 'bold' }}>{item?.day?.avgtemp_c}°C</Text>
              </View>

            </Animatable.View>
          )}
        /> 
      </View>
      :
         <Animatable.View
  animation="fadeInLeft"
  duration={2000}
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

  {Activities?.response?.activities.length === 0 ? (
    <Animatable.View>
      <Text>Sorry, we are still working on more recommendations. Try another location.</Text>
    </Animatable.View>
  ) : (
    <FlatList
      data={Activities?.response?.activities || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) =>
        response?.current?.condition?.text.includes(item.condition) ? (
          <Animatable.View animation="fadeIn" duration={2000} style={styles.activityItem}>
            <FontAwesome6 name="check-circle" size={24} color="#FF914D" />
            <Text style={styles.activityText}>{item?.activity}</Text>
          </Animatable.View>
        ) : null // Don't render anything if condition doesn't match
      }
    />
  )}
</Animatable.View>
}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  current:{
    alignItems:'flex-end'
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
    alignItems: "flex-start",
    width: "100%",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    width: '50%'
  },
  forecastItem: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 18,
    justifyContent: 'space-between',
    borderColor: '#FF914D',
    borderWidth: 2
  },
  forecastText: {
    fontSize: 16,
    color: "#333",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderColor: '#FF914D',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  activityText: {
    fontSize: 16,
    marginLeft: 8,
  }
});

export default Home;
