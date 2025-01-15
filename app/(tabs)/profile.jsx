import { useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
  

function Profile() {
  const dispatch = useDispatch();
  const { response, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(get);
  }, [dispatch]);

  if (status === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF914D" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      {user ? (
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>Name: {user.name}</Text>
          <Text style={styles.userEmail}>Email: {user.email}</Text>
          <Text style={styles.userFavorites}>Favorites:</Text>
          <FlatList
            data={user.favorites}
            renderItem={({ item }) => <Text style={styles.favoriteItem}>{item.name}</Text>}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      ) : (
        <Text>No user data available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFC",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  profileContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 18,
    marginBottom: 20,
  },
  userFavorites: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  favoriteItem: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default Profile;
