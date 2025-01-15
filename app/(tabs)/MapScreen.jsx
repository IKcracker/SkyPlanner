import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TextInput, Button } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentWeather } from "../../Redux/weather/weather";

const MapScreen = ({ route = {} }) => {  
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { response } = useSelector((state) => state.weather);
  const dispatch = useDispatch();
  const { params = {} } = route;  
  const paramValue = params.paramName;

  const [searchedLocation, setSearchedLocation] = useState(params.location || "");  // Initialize searchedLocation

  useEffect(() => {
    if (searchedLocation) {
      setLoading(true);
      dispatch(getCurrentWeather(searchedLocation));
      setLoading(false);
    } else {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      })();
    }
  }, [searchedLocation]);

  const handleSearchLocation = async () => {
    setLoading(true);
    dispatch(getCurrentWeather(searchedLocation));
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 8,
        }}
        placeholder="Search for a location"
        value={searchedLocation}
        onChangeText={(text) => setSearchedLocation(text)}
      />
      <Button title="Search" onPress={handleSearchLocation} />
      {loading ? (
        <ActivityIndicator size="large" color="#FF914D" />
      ) : (
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: location?.latitude || response?.location?.lat || 37.78825,
            longitude: location?.longitude || response?.location?.lon || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
          )}
          {response && (
            <Marker
              coordinate={{
                latitude: response.location.lat,
                longitude: response.location.lon,
              }}
              title={response.location.name}
            />
          )}
        </MapView>
      )}
    </View>
  );
};

export default MapScreen;