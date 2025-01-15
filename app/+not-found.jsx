import { router } from "expo-router";
import { View , StyleSheet, Pressable, Text } from "react-native";

function NotfoundScreen() {
  return ( 
    <View style ={styles.container}>
      <Text>Not Found</Text>
      <Pressable style={styles.Button} onPress={()=> router.replace("index")}>
        <Text>Go to Home</Text>
      </Pressable>
    </View>
   );
}
const styles =StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button: {
    backgroundColor: '#F9FAFC',
    color: '#FDC185',
    padding: 10,
    borderRadius: 5,
  },
})
export default NotfoundScreen;